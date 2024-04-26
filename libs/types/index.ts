export interface OctokitRestCommonParamsType {
    owner: string
    repo: string
}

export interface CreateIssueParams {
    title: string
    body?: string
    assignee?: string
    labels?: string[]
}
