import * as github from '@actions/github'

export const getOctokitRestCommonParams = () => {
    const {
        repo: {owner, repo},
    } = github.context

    return {owner, repo}
}

export const isTrueString = (value: string) => {
    return value === 'true'
}
