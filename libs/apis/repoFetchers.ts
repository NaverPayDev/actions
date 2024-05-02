import core from '@actions/core'
import github from '@actions/github'

import {OctokitRestCommonParamsType} from '$actions/types'

const createRepoFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const repoApi = github.getOctokit(GITHUB_TOKEN).rest.repos

    const getFileContent = async (path: string) => {
        const {data: contentData} = await repoApi.getContent({
            ...octokitRestCommonParams,
            path,
            ref: github.context.sha,
        })

        if (typeof contentData !== 'object' || !('content' in contentData)) {
            core.setFailed('파일 위치를 확인해주세요.')
            return ''
        }
        const contentString = Buffer.from(contentData.content, 'base64').toString()

        return contentString
    }

    return {getFileContent}
}

export default createRepoFetchers
