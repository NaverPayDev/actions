import * as core from '@actions/core'

import createFetchers from '$actions/apis'
import {getOctokitRestCommonParams} from '$actions/utils'

import {defaultBlockerLabel} from './constant'

const main = async () => {
    const octokitRestCommonParams = getOctokitRestCommonParams()

    if (!octokitRestCommonParams.repo || !octokitRestCommonParams.owner) {
        core.setFailed('필수 정보 (repo, owner)를 가지고 오지 못했습니다.')
        return
    }

    const blockerLabel = core.getInput('BLOCKER_LABEL_NAME') || defaultBlockerLabel

    const {
        issueFetchers: {getLabelListOnIssue},
    } = createFetchers()

    try {
        const labels = await getLabelListOnIssue()

        if (labels.includes(blockerLabel)) {
            core.setFailed(`${blockerLabel}이 있으므로 병합 할 수 없습니다`)
        }
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
