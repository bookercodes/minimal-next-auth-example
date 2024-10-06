import { cookies } from "next/headers"
import db from "./db"
import { randomBytes } from "crypto"

const SESSION_COOKIE = "session"
const SESSION_DURATION_MINUTES = 20

export function auth() {
  const sessionId = cookies().get(SESSION_COOKIE)?.value
  if (!sessionId) {
    return { isSignedIn: false }
  }

  let session: any
  try {
    session = db
      .prepare(
        `SELECT s.*, u.name AS user_name 
        FROM sessions s
        JOIN users u ON s.user_id = u.user_id
        WHERE s.session_id = ?`
      )
      .get(sessionId)
  } catch (error) {
    console.error("error SELECTING session", error)
    return { isSignedIn: false }
  }

  if (!session) {
    return { isSignedIn: false }
  }

  const expired = new Date(session.expires) < new Date()
  if (expired) {
    return { isSignedIn: false }
  }

  return {
    userId: session.user_id,
    username: session.user_name,
    isSignedIn: true
  }
}

export function startSession(userId: number | bigint): void {
  const sessionId = randomBytes(16).toString("base64url")

  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + SESSION_DURATION_MINUTES)

  try {
    db.prepare(
      `INSERT INTO sessions (session_id, user_id, expires) 
       VALUES (?, ?, ?)`
    ).run(sessionId, userId, expires.toISOString())
  } catch (error) {
    console.error("error INSERTING session", error)
    return
  }

  cookies().set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: "lax",
    path: "/"
  })
}

export function deleteSession() {
  cookies().delete(SESSION_COOKIE)
}
