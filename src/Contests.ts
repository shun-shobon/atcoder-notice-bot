import moment from "moment"
import request from "request-promise"
import { readFileSync } from "fs"
import { resolve } from "path"
import admin from "firebase-admin"
import { JSDOM } from "jsdom"

interface ContestData {
  date: moment.Moment
  title: string
}

const token = JSON.parse(readFileSync(resolve("firestore-token.json"), "utf-8"))
admin.initializeApp({ credential: admin.credential.cert(token) })
const database = admin.firestore()

export async function getContests(): Promise<ContestData[]> {
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

export async function getSavedContests(): Promise<ContestData[]> {
  const data = await database.collection("contest-upcoming").get()
  const returnData: ContestData[] = []
  data.forEach((doc) => {
    const title = doc.data().title
    const date = doc.data().date
    if (!title || !date) return
    returnData.push({ date: moment(date.toDate()), title })
  })
  return returnData
}

export async function getUnsavedContests(): Promise<ContestData[]> {
  const savedContests = await getSavedContests()
  const contests = await getContests()
  if (!savedContests.length) return contests
  return contests.filter((contest: ContestData): boolean =>
    savedContests.some(
      (savedContest: ContestData): boolean =>
        savedContest.title !== contest.title,
    ),
  )
}
