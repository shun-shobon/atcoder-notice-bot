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

export function getSavedContests(): ContestData[] {
  let strData
  try {
    strData = fs.readFileSync(path.resolve(dataFileName), "utf-8")
  } catch {
    return []
  }
  return JSON.parse(strData).map(
    (contest: ContestData): ContestData => {
      const strDate = contest.date
      contest.date = moment(strDate)
      return contest
    },
  )
}

export function saveContests(contests: ContestData[]): void {
  const savedData = getSavedContests()
  const unsavedContests: ContestData[] = contests
    .filter((contest: ContestData): boolean => {
      if (!savedData.length) return true
      return savedData.some((data) => data.title !== contest.title)
    })
    .map(
      (contest: ContestData): ContestData => {
        return {
          ...contest,
          isNotifiedCreating: false,
          isNotifiedJustBefore: false,
        }
      },
    )
  savedData.push(...unsavedContests)
  fs.writeFileSync(
    path.resolve(dataFileName),
    JSON.stringify(savedData, null, 2),
  )
}

export function getSavedNotNotifiedCreating(): ContestData[] {
  return getSavedContests().filter(
    (contest: ContestData): boolean => contest.isNotifiedCreating === false,
  )
}

export function getSavedNotNotifiedJustBefore(): ContestData[] {
  return getSavedContests().filter(
    (contest: ContestData): boolean => contest.isNotifiedJustBefore === false,
  )
}
