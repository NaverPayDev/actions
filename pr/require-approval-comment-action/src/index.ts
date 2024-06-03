import * as core from '@actions/core'

import createFetchers from '$actions/apis'
import {getOctokitRestCommonParams} from '$actions/utils'

const main = async () => {
    const octokitRestCommonParams = getOctokitRestCommonParams()

    if (!octokitRestCommonParams.repo || !octokitRestCommonParams.owner) {
        core.setFailed('필수 정보 (repo, owner)를 가지고 오지 못했습니다.')
    }

    const {
        pullFetchers: {getPullRequestReviews, dismissReview},
    } = createFetchers()

    try {
        const reviews = await getPullRequestReviews()

        for (const review of reviews) {
            const {body: comment, id: review_id} = review
            if (review.state === 'APPROVED') {
                const isEmptyComment = Boolean(comment.trim()) === false

                if (isEmptyComment) {
                    await dismissReview(review_id)
                }
            }
        }
    } catch (error) {
        const {message} = error as Error

        core.setFailed(message)
    }
}

main()
