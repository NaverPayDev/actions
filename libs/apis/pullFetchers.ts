import * as core from '@actions/core'
import * as github from '@actions/github'

import {OctokitRestCommonParamsType} from '$actions/types'

const createPullFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const pullApi = github.getOctokit(GITHUB_TOKEN).rest.pulls
    const {
        issue: {number: pull_number},
    } = github.context

    /**
     * pull request 정보를 가져옵니다.
     * see) https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#get-a-pull-request
     */
    const getPullRequestInfo = async () => {
        const {data: pullInfo} = await pullApi.get({
            ...octokitRestCommonParams,
            pull_number,
        })

        return pullInfo
    }

    return {getPullRequestInfo}
}

export default createPullFetchers
