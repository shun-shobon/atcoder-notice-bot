import moment from "moment"
import request from "request-promise"
import * as admin from "firebase-admin"
import * as functions from "firebase-functions"

interface ContestData {
  date: moment.Moment
  title: string
}

interface Token {
  id: string
  token: string
}

const lineTokenSavePath = "line-token"
const publishTopicName = "publish"

const database = admin.firestore()

async function getLineTokens(): Promise<Token[]> {
  const data = await database.collection(lineTokenSavePath).get()
  const returnArray: Token[] = []
  data.forEach((doc) => {
    const id = doc.id
    const token = doc.data().token
    if (!id || !token) return
    returnArray.push({ id, token })
  })
  return returnArray
}

async function publishToLine(
  contest: ContestData,
  tokenData: Token,
): Promise<void> {
  const strDate = contest.date.format("M月D日HH時mm分")
  const title = contest.title
  const tokenId = tokenData.id
  const token = tokenData.token
  const revokeTokenUrl = `${functions.config().line.url}/line/revoke/${tokenId}`

  const message = `開催通知
${strDate}に${title}が開催されます！

通知の解除はこちらから=> ${revokeTokenUrl}`

  const options = {
    uri: "https://notify-api.line.me/api/notify",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    form: {
      message,
    },
  }
  await request.post(options)
}

function parsePubSubData(data: functions.pubsub.Message): ContestData {
  const strDate = data.json.date
  const title = data.json.title
  return {
    date: moment(strDate),
    title,
  }
}

export default functions
  .region("asia-northeast1")
  .pubsub.topic(publishTopicName)
  .onPublish(async (message) => {
    const contest = parsePubSubData(message)
    const tokens = await getLineTokens()
    const publishPromise: Promise<void>[] = []
    tokens.forEach((token) => {
      publishPromise.push(publishToLine(contest, token))
    })
    await Promise.all(publishPromise)
  })
