import { cookies } from "next/headers"
import db from "./db"
import { randomBytes } from "crypto"

export function findSession(sessionId: any) {
  const stmt = db.prepare(`
        SELECT s.*, u.name AS user_name 
        FROM sessions s
        JOIN users u ON s.user_id = u.user_id
        WHERE s.session_id = ?
    `)

  // Execute the query with the session_id
  const session = stmt.get(sessionId)
  return session
}

export function startSession(userId: number | bigint): void {
  const sessionId = randomBytes(16).toString("base64url")

  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + 20)

  try {
    db.prepare(
      `
    INSERT INTO sessions (session_id, user_id, expires) 
    VALUES (?, ?, ?)`
    ).run(sessionId, userId, expires.toISOString())
  } catch (error) {
    console.error("error inserting session", error)
    return
  }

  cookies().set("session", sessionId, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: "lax",
    path: "/"
  })
}
