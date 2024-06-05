COMMIT_MSG_FILE=$1

npx --yes @naverpay/commit-helper@latest $1
npm run action:donotmergeaction build
npm run action:requireapprovalcommentaction build
npm run action:autoassignpullrequesttoauthoraction build
npm run action:creatediscussion build
