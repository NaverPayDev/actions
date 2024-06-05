import {getOctokitRestCommonParams} from '$actions/utils'

import createIssueFetchers from './issueFetchers'
import createPullFetchers from './pullFetchers'
import createRepoFetchers from './repoFetchers'

const octokitRestCommonParams = getOctokitRestCommonParams()

const createFetchers = () => {
    return {
        issueFetchers: createIssueFetchers(octokitRestCommonParams),
        pullFetchers: createPullFetchers(octokitRestCommonParams),
        repoFetchers: createRepoFetchers(octokitRestCommonParams),
    }
}

export default createFetchers
