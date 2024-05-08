import {getOctokitRestCommonParams} from '$actions/utils'

import createIssueFetchers from './issueFetchers'
import createPullFetchers from './pullFetchers'

const octokitRestCommonParams = getOctokitRestCommonParams()

const createFetchers = () => {
    return {
        issueFetchers: createIssueFetchers(octokitRestCommonParams),
        pullFetchers: createPullFetchers(octokitRestCommonParams),
    }
}

export default createFetchers
