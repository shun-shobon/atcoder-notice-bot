import * as admin from "firebase-admin"

interface Token {
  id: string
  token: string
}

const lineTokenSavePath = "line-token"

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
