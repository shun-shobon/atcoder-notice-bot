import moment from "moment"
import request from "request-promise"
import { JSDOM } from "jsdom"

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
