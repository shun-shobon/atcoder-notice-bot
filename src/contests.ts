import moment from "moment"
import request from "request-promise"
import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { JSDOM } from "jsdom"
import { PubSub } from "@google-cloud/pubsub"

interface ContestData {
  date: moment.Moment
  title: string
}

const contestSavePath = "contest-upcoming"
const scrapingTopicName = "cron-scraping"
const publishTopicName = "publish"

const database = admin.firestore()
const pubSubClient = new PubSub()

async function getContests(): Promise<ContestData[]> {
  const url = "https://atcoder.jp/contests/?lang=ja"
  const body = await request(url)
  const dom = new JSDOM(body)
  return Array.from(
    dom.window.document.querySelectorAll(
      "#contest-table-upcoming > div > div > table > tbody > tr",
    ),
  ).map(
    (contest): ContestData => {
      const [strDate, title] = Array.from(contest.querySelectorAll("a")).map(
        (a) => a.text,
      )
      const date = moment(strDate)
      return { date, title }
    },
  )
}

async function getSavedContests(): Promise<ContestData[]> {
  const data = await database.collection(contestSavePath).get()
  const returnData: ContestData[] = []
  data.forEach((doc) => {
    const title = doc.data().title
    const date = doc.data().date
    if (!title || !date) return
    returnData.push({ date: moment(date.toDate()), title })
  })
  return returnData
}

function getUnsavedContests(
  contests: ContestData[],
  savedContests: ContestData[],
): ContestData[] {
  if (!savedContests.length) return contests
  return contests.filter((contest: ContestData): boolean =>
    savedContests.some(
      (savedContest: ContestData): boolean =>
        savedContest.title !== contest.title,
    ),
  )
}

async function saveContests(contests: ContestData[]): Promise<void> {
  const savePromise = contests.map((contest: ContestData) =>
    database.collection(contestSavePath).add({
      date: contest.date.toDate(),
      title: contest.title,
    }),
  )
  await Promise.all(savePromise)
}

async function publishContests(contests: ContestData[]): Promise<void> {
  const publishPromise = contests.map(
    (contest: ContestData): Promise<string> => {
      return pubSubClient
        .topic(publishTopicName)
        .publish(Buffer.from(JSON.stringify(contest)))
    },
  )
  return Promise.all(publishPromise).then((messageId: string[]): void =>
    messageId.forEach(console.log),
  )
}

export default functions
  .region("asia-northeast1")
  .pubsub.topic(scrapingTopicName)
  .onPublish(
    async (): Promise<void> => {
      const [contests, savedContests] = await Promise.all([
        getContests(),
        getSavedContests(),
      ])
      const unsavedContests = getUnsavedContests(contests, savedContests)
      unsavedContests.forEach((contest: ContestData) => console.log(contest))
      await Promise.all([
        saveContests(unsavedContests),
        publishContests(unsavedContests),
      ])
    },
  )
