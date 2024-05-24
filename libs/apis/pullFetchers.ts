import * as core from '@actions/core'
import * as github from '@actions/github'
import {RestEndpointMethodTypes} from '@octokit/rest'

import {OctokitRestCommonParamsType} from '$actions/types'

const createPullFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(GITHUB_TOKEN)
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

    /**
     * pull request 의 review list를 가져옵니다.
     * see) https://docs.github.com/en/rest/pulls/comments?apiVersion=2022-11-28#list-review-comments-on-a-pull-request
     */
    const getPullRequestReviews = async () => {
        const reviewList: RestEndpointMethodTypes['pulls']['listReviews']['response']['data'] = []

        for await (const response of octokit.paginate.iterator(octokit.rest.pulls.listReviews, {
            ...octokitRestCommonParams,
            pull_number,
            per_page: 100,
        })) {
            reviewList.push(...response.data)
        }

        return reviewList
    }

    return {getPullRequestInfo, getPullRequestReviews}
}

export default createPullFetchers
