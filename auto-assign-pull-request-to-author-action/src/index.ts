import * as core from '@actions/core'
import * as github from '@actions/github'

import createFetchers from '$actions/apis'
import {getOctokitRestCommonParams} from '$actions/utils'

const main = async () => {
    const octokitRestCommonParams = getOctokitRestCommonParams()

    if (!octokitRestCommonParams.repo || !octokitRestCommonParams.owner) {
        core.setFailed('필수 정보 (repo, owner)를 가지고 오지 못했습니다.')
        return
    }
    const {actor} = github.context

    const {
        issueFetchers: {addAssigneesOnIssue},
    } = createFetchers()

    try {
        await addAssigneesOnIssue([actor])
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
