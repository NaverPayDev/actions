import {OctokitRestCommonParamsType} from '$actions/types'
import * as core from '@actions/core'
import * as github from '@actions/github'

const createCheckFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const checkApi = github.getOctokit(GITHUB_TOKEN).rest.checks

    const getCheckRunsForRef = async (ref: string) => {
        const {data: pullInfo} = await checkApi.listForRef({
            ...octokitRestCommonParams,
            ref,
        })

        return pullInfo
    }

    const rerequestRun = async (check_run_id: number) => {
        const {data: pullInfo} = await checkApi.rerequestRun({
            ...octokitRestCommonParams,
            check_run_id,
        })

        return pullInfo
    }

    return {getCheckRunsForRef, rerequestRun}
}

export default createCheckFetchers
