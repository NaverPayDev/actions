export type IssueState = 'open' | 'closed'

export interface CommonIssueParams {
    title: string
    body?: string
    assignee?: string
    labels?: string[]
}

export interface UpdateIssueParams {
    issueNumber: number
    title?: string
    body?: string
    assignee?: string
    labels?: string[]
    state?: IssueState
}
