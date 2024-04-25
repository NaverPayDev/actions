import {OctokitRestCommonParamsType} from '$actions/types'
import * as core from '@actions/core'
import * as github from '@actions/github'

const createPullFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const pullApi = github.getOctokit(GITHUB_TOKEN).rest.pulls
    const {
        issue: {number: pull_number},
    } = github.context

    const getPullInfo = async () => {
        const {data: pullInfo} = await pullApi.get({
            ...octokitRestCommonParams,
            pull_number,
        })

        return pullInfo
    }

    return {getPullInfo}
}

export default createPullFetchers
