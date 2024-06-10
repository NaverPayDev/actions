import * as core from '@actions/core'
import * as github from '@actions/github'

import {OctokitRestCommonParamsType} from '$actions/types'

const createRepoFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const repoApi = github.getOctokit(GITHUB_TOKEN).rest.repos

    const getRepoInfo = async () => {
        const {data: repoInfo} = await repoApi.get({
            ...octokitRestCommonParams,
        })

        return repoInfo
    }

    return {getRepoInfo}
}

export default createRepoFetchers
