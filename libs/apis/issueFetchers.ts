import core from '@actions/core'
import github from '@actions/github'

import {CreateIssueParams, OctokitRestCommonParamsType} from '$actions/types'

const createIssueFetchers = (octokitRestCommonParams: OctokitRestCommonParamsType) => {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const issueApi = github.getOctokit(GITHUB_TOKEN).rest.issues
    const {
        issue: {number: issue_number},
    } = github.context

    const getIssueInfo = async () => {
        const {data: issueInfo} = await issueApi.get({
            ...octokitRestCommonParams,
            issue_number,
        })

        return issueInfo
    }

    const getOpenIssueList = async () => {
        const {data: issueList} = await issueApi.listForRepo({
            ...octokitRestCommonParams,
        })

        return issueList
    }

    const getAllIssueList = async () => {
        const {data: issueList} = await issueApi.listForRepo({
            ...octokitRestCommonParams,
            state: 'all',
        })

        return issueList
    }

    const createIssue = async (params: CreateIssueParams) => {
        issueApi.create({...octokitRestCommonParams, ...params})
    }

    const closeIssue = async (issueNumber: number) => {
        issueApi.update({...octokitRestCommonParams, issue_number: issueNumber, state: 'closed'})
    }

    const replaceLabels = async (issueNumber: number, labels: string[]) => {
        issueApi.update({...octokitRestCommonParams, issue_number: issueNumber, labels})
    }

    const changeTitle = async (issueNumber: number, title: string) => {
        issueApi.update({...octokitRestCommonParams, issue_number: issueNumber, title})
    }

    const getLabelListOnIssue = async (number?: number) => {
        const {data: labelInfos} = await issueApi.listLabelsOnIssue({
            ...octokitRestCommonParams,
            issue_number: number ?? issue_number,
        })

        const labels = labelInfos.map((labelInfo) => labelInfo.name)

        return labels
    }

    const getAssigneeListOnIssue = async () => {
        const {
            data: {assignees: assigneeInfos},
        } = await issueApi.get({...octokitRestCommonParams, issue_number})

        if (!assigneeInfos) {
            return []
        }

        return assigneeInfos?.map((assigneeInfo) => assigneeInfo.login)
    }

    const addAssigneesOnIssue = async (assignees: string[]) => {
        issueApi.addAssignees({...octokitRestCommonParams, issue_number, assignees})
    }

    const removeAssigneesOnIssue = async (assignees: string[]) => {
        issueApi.removeAssignees({
            ...octokitRestCommonParams,
            issue_number,
            assignees,
        })
    }

    const addComment = async (body: string) => {
        issueApi.createComment({...octokitRestCommonParams, issue_number, body})
    }

    return {
        getIssueInfo,
        getOpenIssueList,
        getAllIssueList,
        createIssue,
        closeIssue,
        getAssigneeListOnIssue,
        getLabelListOnIssue,
        addAssigneesOnIssue,
        removeAssigneesOnIssue,
        addComment,
        replaceLabels,
        changeTitle,
    }
}

export default createIssueFetchers
