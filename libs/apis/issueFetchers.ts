import * as core from '@actions/core'
import * as github from '@actions/github'
import {RestEndpointMethodTypes} from '@octokit/rest'

import {CommonIssueParams, IssueState, OctokitRestCommonParamsType, UpdateIssueParams} from '$actions/types'

const createIssueFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(GITHUB_TOKEN)
    const issueApi = octokit.rest.issues
    const {
        issue: {number: issue_number},
    } = github.context

    /**
     * 특정 이슈 정보를 가져옵니다.
     * see) https://docs.github.com/ko/rest/issues/issues?apiVersion=2022-11-28#get-an-issue
     */
    const getIssueInfo = async () => {
        const {data: issueInfo} = await issueApi.get({
            ...octokitRestCommonParams,
            issue_number,
        })

        return issueInfo
    }

    /**
     * 레포의 모든 이슈 목록을 가져옵니다.
     * issueState 가 없으면 default로 열린 issue만 불러옵니다.
     * see) https://docs.github.com/ko/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
     */
    const getIssueList = async (state: IssueState | 'all') => {
        const issueList: RestEndpointMethodTypes['issues']['list']['response']['data'] = []

        for await (const response of octokit.paginate.iterator(octokit.rest.issues.list, {
            ...octokitRestCommonParams,
            state,
            per_page: 100,
        })) {
            issueList.push(...response.data)
        }

        return issueList
    }

    /**
     * 이슈를 생성합니다.
     * see) https://docs.github.com/ko/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
     */
    const createIssue = async (params: CommonIssueParams) => {
        issueApi.create({...octokitRestCommonParams, ...params})
    }

    /**
     * 이슈를 업데이트 합니다.
     * see) https://docs.github.com/ko/rest/issues/issues?apiVersion=2022-11-28#update-an-issue
     */
    const updateIssue = async ({issueNumber, ...restParams}: UpdateIssueParams) => {
        issueApi.update({...octokitRestCommonParams, issue_number: issueNumber, ...restParams})
    }

    /**
     * 이슈의 라벨 리스트를 조회합니다.
     * see) https://docs.github.com/ko/rest/issues/labels?apiVersion=2022-11-28#list-labels-for-an-issue
     */
    const getLabelListOnIssue = async (issueNumber?: number) => {
        const {data: labelInfos} = await issueApi.listLabelsOnIssue({
            ...octokitRestCommonParams,
            issue_number: issueNumber ?? issue_number,
        })

        const labels = labelInfos.map((labelInfo) => labelInfo.name)

        return labels
    }

    /**
     * 이슈에 assignee를 추가합니다.
     * see) https://docs.github.com/ko/rest/issues/assignees?apiVersion=2022-11-28#add-assignees-to-an-issue
     */
    const addAssigneesOnIssue = async (assignees: string[]) => {
        issueApi.addAssignees({...octokitRestCommonParams, issue_number, assignees})
    }

    /**
     * 이슈에 assignee를 제거합니다.
     * see) https://docs.github.com/ko/rest/issues/assignees?apiVersion=2022-11-28#remove-assignees-from-an-issue
     */
    const removeAssigneesOnIssue = async (assignees: string[]) => {
        issueApi.removeAssignees({
            ...octokitRestCommonParams,
            issue_number,
            assignees,
        })
    }

    /**
     * 이슈에 comment를 추가합니다.
     * see) https://docs.github.com/ko/rest/issues/comments?apiVersion=2022-11-28#create-an-issue-comment
     */
    const addComment = async (body: string) => {
        issueApi.createComment({...octokitRestCommonParams, issue_number, body})
    }

    /**
     * 이슈가 존재하는 레포의 label 목록을 가져옵니다.
     * see) https://docs.github.com/en/rest/issues/labels#list-labels-for-a-repository
     */
    const getRepoLabels = async () => {
        const {data: repoLabels} = await issueApi.listLabelsForRepo({...octokitRestCommonParams})

        return repoLabels
    }

    return {
        getIssueInfo,
        getIssueList,
        createIssue,
        updateIssue,
        getLabelListOnIssue,
        addAssigneesOnIssue,
        removeAssigneesOnIssue,
        addComment,
        getRepoLabels,
    }
}

export default createIssueFetchers
