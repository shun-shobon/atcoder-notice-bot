import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
admin.initializeApp(functions.config().firebase)

import contests from "./contests"

export const scrapingContests = contests
