import * as core from '@actions/core'

import createFetchers from '$actions/apis'
import {getOctokitRestCommonParams} from '$actions/utils'

import {DEFAULT_STALE_MONTH, MONTH_TO_MS} from './constants'

const main = async () => {
    const octokitRestCommonParams = getOctokitRestCommonParams()

    if (!octokitRestCommonParams.repo || !octokitRestCommonParams.owner) {
        core.setFailed('필수 정보 (repo, owner)를 가지고 오지 못했습니다.')
        return
    }

    const staleMonth = Number(core.getInput('STALE_MONTH')) || DEFAULT_STALE_MONTH
    const currentDateTime = new Date().getTime()

    const {
        repoFetchers: {getBranch, getBranches, deleteBranch},
    } = createFetchers()

    try {
        const branches = await getBranches()

        branches.forEach(async ({name}) => {
            const branchInfo = await getBranch(name)

            const recentCommitDateTime = new Date(
                branchInfo.commit.commit.committer?.date || new Date().toString(),
            ).getTime()

            /** 브랜치 최신 커밋까지 기간이 기준 시간보다 길면 삭제합니다. */
            if (currentDateTime - recentCommitDateTime > staleMonth * MONTH_TO_MS) {
                await deleteBranch(name)
            }
        })
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
