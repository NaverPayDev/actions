import * as core from '@actions/core'
import * as github from '@actions/github'

import createFetchers from '$actions/apis'
import {getOctokitRestCommonParams, isTrueString} from '$actions/utils'

const main = async () => {
    const octokitRestCommonParams = getOctokitRestCommonParams()

    if (!octokitRestCommonParams.repo || !octokitRestCommonParams.owner) {
        core.setFailed('필수 정보 (repo, owner)를 가지고 오지 못했습니다.')
        return
    }

    const checklist: Record<'assignee' | 'label' | 'milestone', {shouldCheck: boolean; exists: boolean}> = {
        assignee: {
            shouldCheck: isTrueString(core.getInput('CHECK_ASSIGNEE')),
            exists: false,
        },
        label: {
            shouldCheck: isTrueString(core.getInput('CHECK_LABEL')),
            exists: false,
        },
        milestone: {
            shouldCheck: isTrueString(core.getInput('CHECK_MILESTONE')),
            exists: false,
        },
    }

    // 체크할지 여부가 모두 false이면 fail
    if (!checklist.assignee.shouldCheck && !checklist.label.shouldCheck && !checklist.milestone.shouldCheck) {
        core.setFailed(
            '체크할 내용을 workflow에 작성해주세요.\nsee) https://github.com/NaverPayDev/actions/tree/main/issue/request-issue-attribute-action',
        )
        return
    }

    const {actor} = github.context

    const {
        issueFetchers: {getIssueInfo, addComment},
    } = createFetchers()

    try {
        const {assignee, labels, milestone} = await getIssueInfo()

        checklist.assignee.exists = !!assignee
        checklist.label.exists = labels.length > 0
        checklist.milestone.exists = !!milestone

        const checkFailedString = Object.entries(checklist)
            .map(([key, {exists, shouldCheck}]) => (!exists && shouldCheck ? key : ''))
            .filter((value) => !!value)
            .join(', ')

        await addComment(`@${actor} 님, 이슈에 ${checkFailedString} 을 작성해 주세요.`)
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
