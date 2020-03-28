import moment from "moment"
import path from "path"
import fs from "fs"
import request from "request-promise"
import { JSDOM } from "jsdom"

const dataFileName = "contests.json"

interface ContestData {
  date: moment.Moment
  title: string
  isNotifiedCreating?: boolean
  isNotifiedJustBefore?: boolean
}

export async function contests(): Promise<ContestData[]> {
  const url = "https://atcoder.jp/contests/?lang=ja"
  const body = await request(url)
  const dom = new JSDOM(body)
  return Array.from(
    dom.window.document.querySelectorAll(
      "#contest-table-upcoming > div > div > table > tbody > tr",
    ),
  ).map((contest) => {
    const [strDate, title] = Array.from(contest.querySelectorAll("a")).map(
      (a) => a.text,
    )
    const date = moment(strDate)
    return { date, title }
  })
}

export function getSavedContests(): ContestData[] {
  let strData
  try {
    strData = fs.readFileSync(path.resolve(dataFileName), "utf-8")
  } catch {
    return []
  }
  return JSON.parse(strData).map((contest: ContestData) => {
    const strDate = contest.date
    contest.date = moment(strDate)
    return contest
  })
}
