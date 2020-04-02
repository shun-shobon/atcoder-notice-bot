import request from "request-promise"
import corsLib from "cors"
import * as admin from "firebase-admin"
import * as functions from "firebase-functions"

const cors = corsLib({
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE",
  origin: functions.config().line.url,
  preflightContinue: false,
})

const database = admin.firestore()

const tokenSavePath = "line-token"

async function getToken(code: string): Promise<string> {
  const options = {
    uri: "https://notify-bot.line.me/oauth/token",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    form: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      grant_type: "authorization_code",
      // eslint-disable-next-line @typescript-eslint/camelcase
      code: code,
      // eslint-disable-next-line @typescript-eslint/camelcase
      redirect_uri: functions.config().line.redirect_uri,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: functions.config().line.client_id,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_secret: functions.config().line.client_secret,
    },
    json: true,
  }
  const res = await request.post(options)
  return res.access_token
}

async function saveToken(token: string): Promise<void> {
  await database.collection(tokenSavePath).add({ token })
}

export default functions
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
    return cors(req, res, async () => {
      const code = req.body.code
      if (!code) {
        return res.status(400).json({
          status: 400,
          message: "undefined params",
        })
      }
      let token
      try {
        token = await getToken(code)
      } catch {
        return res.status(400).json({
          status: 400,
          message: "invalid code",
        })
      }
      if (!token) {
        return res.status(400).json({
          status: 400,
          message: "invalid code",
        })
      }
      await saveToken(token)
      return res.status(200).json({
        status: 200,
        message: "token is issued",
      })
    })
  })
