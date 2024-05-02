import {getOctokitRestCommonParams} from '$actions/utils'

import createCheckFetchers from './checkFetchers'
import createIssueFetchers from './issueFetchers'
import createPullFetchers from './pullFetchers'
import createRepoFetchers from './repoFetchers'
import createTeamFetchers from './teamFetchers'
import createUserFetchers from './userFetchers'

const octokitRestCommonParams = getOctokitRestCommonParams()

const createFetchers = () => {
    return {
        issueFetchers: createIssueFetchers(octokitRestCommonParams),
        repoFetchers: createRepoFetchers(octokitRestCommonParams),
        pullFetchers: createPullFetchers(octokitRestCommonParams),
        checkFetchers: createCheckFetchers(octokitRestCommonParams),
        userFetchers: createUserFetchers(octokitRestCommonParams),
        teamFetchers: createTeamFetchers(octokitRestCommonParams),
    }
}

export default createFetchers
