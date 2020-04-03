import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
admin.initializeApp(functions.config().firebase)

import * as contests from "./contests"
import * as lineToken from "./lineToken"
import publish from "./publish"

export const scrapingContests = contests.scrapingContest
export const publishUpcomingContests = contests.publishUpcomingContest
export const issueLineToken = lineToken.issue
export const revokeLineToken = lineToken.revoke
export const publishMessage = publish
