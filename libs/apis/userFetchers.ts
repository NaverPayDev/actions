import * as core from '@actions/core'
import * as github from '@actions/github'

import {OctokitRestCommonParamsType} from '$actions/types'

const createUserFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const userApi = github.getOctokit(GITHUB_TOKEN).rest.users

    const getUserInfoByUsername = async (username: string) => {
        const {data: userInfo} = await userApi.getByUsername({
            ...octokitRestCommonParams,
            username,
        })

        return userInfo
    }

    return {getUserInfoByUsername}
}

export default createUserFetchers
