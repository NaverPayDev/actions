import * as core from '@actions/core'

import createFetchers from '$actions/apis'
import {getOctokitRestCommonParams} from '$actions/utils'

import {DEFAULT_STALE_MONTH, MONTH_TO_MS} from './constants'

const validateRegex = (regexString: string) => {
    try {
        const regex = new RegExp(regexString)
        return regex
    } catch {
        throw new Error('정규식이 올바르지 않습니다.')
    }
}

const main = async () => {
    const octokitRestCommonParams = getOctokitRestCommonParams()

    if (!octokitRestCommonParams.repo || !octokitRestCommonParams.owner) {
        core.setFailed('필수 정보 (repo, owner)를 가지고 오지 못했습니다.')
        return
    }

    const staleMonth = Number(core.getInput('STALE_MONTH')) || DEFAULT_STALE_MONTH
    const regexString = core.getInput('EXCLUDE_BRANCH_NAME_REG')

    const regex = !!regexString && validateRegex(regexString)

    const currentDateTime = new Date().getTime()

    const {
        repoFetchers: {getBranch, getBranches, deleteBranch, getRepoInfo},
    } = createFetchers()

    try {
        const {default_branch: defaultBranch} = await getRepoInfo()
        const branches = await getBranches({getType: 'UNPROTECTED'})

        /** 정규식에 포함되지 않는 브랜치만 대상으로 필터링 합니다 */
        const filteredBranches = regex ? branches.filter(({name}) => !regex.test(name)) : branches

        filteredBranches.forEach(async ({name}) => {
            if (name === defaultBranch) {
                return
            }

            const branchInfo = await getBranch(name)

            const recentCommitDate = branchInfo.commit.commit.committer?.date || new Date().toString()
            const recentCommitDateTime = new Date(recentCommitDate).getTime()

            /** 브랜치 최신 커밋까지 기간이 기준 시간보다 길면 삭제합니다. */
            if (currentDateTime - recentCommitDateTime > staleMonth * MONTH_TO_MS) {
                /* eslint-disable-next-line no-console */
                console.log(`${recentCommitDate}에 가장 최근 작업이 이루어진 ${name} 브랜치 삭제`)
                await deleteBranch(name)
            }
        })
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
