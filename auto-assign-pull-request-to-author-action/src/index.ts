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

    const ALLOW_ASSIGNEE_ALREADY_EXIST_CONDITION = core.getInput('ALLOW_ASSIGNEE_ALREADY_EXIST_CONDITION')
    const REPLACE_PREV_ASSIGNEE = core.getInput('REPLACE_PREV_ASSIGNEE')

    const {actor} = github.context

    const {
        issueFetchers: {addAssigneesOnIssue, removeAssigneesOnIssue},
        pullFetchers: {getPullRequestInfo},
    } = createFetchers()

    try {
        const {assignees} = await getPullRequestInfo()

        /** assignee가 이미 존재하는데 */
        if (assignees?.length) {
            /** assignee가 있을때도 발동할지 여부가 false인 경우 동작 안함 */
            if (!isTrueString(ALLOW_ASSIGNEE_ALREADY_EXIST_CONDITION)) {
                return
            }

            /** 기존 assignee를 대체할지 여부가 true인 경우 모든 assignee 삭제 */
            if (isTrueString(REPLACE_PREV_ASSIGNEE)) {
                await removeAssigneesOnIssue(assignees.map(({login}) => login).filter((login) => login !== actor))
            }
        }

        await addAssigneesOnIssue([actor])
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
