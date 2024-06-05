import * as core from '@actions/core'
import * as github from '@actions/github'
import {DiscussionCategory} from '@octokit/graphql-schema'

import createFetchers from '$actions/apis'
import {getOctokitRestCommonParams, isTrueString} from '$actions/utils'

import {getDay} from './utils'

const main = async () => {
    const octokitRestCommonParams = getOctokitRestCommonParams()

    if (!octokitRestCommonParams.repo || !octokitRestCommonParams.owner) {
        core.setFailed('필수 정보 (repo, owner)를 가지고 오지 못했습니다.')
    }

    const {repo, owner} = octokitRestCommonParams

    const shouldAddDateOnTitle = isTrueString(core.getInput('ADD_DATE_ON_TITLE'))

    const now = new Date()

    const title = `${shouldAddDateOnTitle ? getDay(now) : ''} ${core.getInput('TITLE') || 'discussion title'}`
    const BODY = core.getInput('BODY') || 'discussion body'

    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
    const octokit = github.getOctokit(GITHUB_TOKEN)

    const {
        repoFetchers: {getRepoInfo},
    } = createFetchers()

    try {
        const {node_id: repoId} = await getRepoInfo()

        const {
            repository: {discussionCategories},
        } = await octokit.graphql<{repository: {discussionCategories: {nodes: DiscussionCategory[]}}}>(`query {
            repository (name: "${repo}", owner: "${owner}") {
                discussionCategories(first: 10) {
                    nodes {
                        id,
                        name
                    }
                }
            }
        }`)

        const categoryId = (
            discussionCategories.nodes.find(({name}) => name === 'Daily Scrum') ?? discussionCategories.nodes[0]
        ).id

        await octokit.graphql(
            `mutation {
                createDiscussion(
                    input: {repositoryId: "${repoId}", categoryId: "${categoryId}", body: "${BODY}", title: "${title}"}
                ) {
                    discussion {
                        id
                    }
                }
            }`,
            {
                repo,
                owner,
                headers: {
                    authorization: GITHUB_TOKEN,
                },
            },
        )
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
