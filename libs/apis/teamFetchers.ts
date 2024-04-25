import {OctokitRestCommonParamsType} from '$actions/types'
import * as core from '@actions/core'
import * as github from '@actions/github'

const createTeamFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const userApi = github.getOctokit(GITHUB_TOKEN).rest.teams

    const getTeamMembers = async (org: string, team_slug: string) => {
        const {data} = await userApi.listMembersInOrg({
            ...octokitRestCommonParams,
            org,
            team_slug,
        })

        return data
    }

    return {getTeamMembers}
}

export default createTeamFetchers
