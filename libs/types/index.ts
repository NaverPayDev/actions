export type OctokitRestCommonParamsType = {
    owner: string
    repo: string
}

export type CreateIssueParams = {
    title: string
    body?: string
    assignee?: string
    labels?: string[]
}
