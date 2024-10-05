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

export function createSession(userId: any) {
  const insertSessionStmt = db.prepare(`
        INSERT INTO sessions (session_id, user_id, start_time, end_time) VALUES (?, ?, ?, ?);
    `)

  const sessionId = randomBytes(16).toString("base64url")
  const startTime = new Date().toISOString() // Current time in ISO format
  const endTime = new Date()
  endTime.setDate(endTime.getDate() + 7) // Add 7 days
  const formattedEndTime = endTime.toISOString() // Convert to ISO format

  try {
    // Execute the insert statement
    insertSessionStmt.run(sessionId, userId, startTime, formattedEndTime)
    console.log(`Session inserted with ID: ${sessionId}`)
    return {
      id: sessionId,
      endTime
    }
  } catch (error) {
    console.error("Error inserting session:", error)
  }
  return null
}
