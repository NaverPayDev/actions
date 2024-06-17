import * as core from '@actions/core'
import * as github from '@actions/github'
import {RestEndpointMethodTypes} from '@octokit/rest'

import {OctokitRestCommonParamsType} from '$actions/types'

const createRepoFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(GITHUB_TOKEN)

    const repoApi = octokit.rest.repos

    /**
     * 레포 정보를 가져옵니다
     * see) https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository
     */
    const getRepoInfo = async () => {
        const {data: repoInfo} = await repoApi.get({
            ...octokitRestCommonParams,
        })

        return repoInfo
    }

    /**
     * 특정 브랜치 정보를 가져옵니다.
     * see) https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#get-a-branch
     */
    const getBranch = async (branch: string) => {
        const {data: branchInfo} = await repoApi.getBranch({
            ...octokitRestCommonParams,
            branch,
        })

        return branchInfo
    }

    /**
     * 레포의 브랜치 목록을 정보를 가져옵니다.
     * getType이 undefined인 경우 모든 브랜치를 가져옵니다.
     * see) https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#list-branches
     */
    const getBranches = async ({getType}: {getType?: 'PROTECTED' | 'UNPROTECTED'}) => {
        const branchList: RestEndpointMethodTypes['repos']['listBranches']['response']['data'] = []

        const protectedBool = getType === 'PROTECTED' ? true : getType === 'UNPROTECTED' ? false : undefined
        for await (const response of octokit.paginate.iterator(repoApi.listBranches, {
            ...octokitRestCommonParams,
            per_page: 100,
            protected: protectedBool,
        })) {
            branchList.push(...response.data)
        }

        return branchList
    }

    /**
     * 특정 브랜치를 삭제합니다. (octokit rest api엔 존재하지 않음)
     * see) https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28#delete-a-reference
     */
    const deleteBranch = async (branch: string) => {
        await octokit.request('DELETE /repos/{owner}/{repo}/git/refs/{ref}', {
            ...octokitRestCommonParams,
            ref: branch,
        })
    }

    return {getRepoInfo, getBranch, getBranches, deleteBranch}
}

export default createRepoFetchers
