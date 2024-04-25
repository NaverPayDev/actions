import createIssueFetchers from './issueFetchers'
import createRepoFetchers from './repoFetchers'
import createPullFetchers from './pullFetchers'
import createCheckFetchers from './checkFetchers'
import createUserFetchers from './userFetchers'
import createTeamFetchers from './teamFetchers'
import {getOctokitRestCommonParams} from '$actions/utils'

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
