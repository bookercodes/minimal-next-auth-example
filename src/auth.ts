import { cookies } from "next/headers"
import db from "./db"

export function createSession(userId: any) {
  const insertSessionStmt = db.prepare(`
        INSERT INTO sessions (user_id, start_time, end_time) VALUES (?, ?, ?);
    `)

  const startTime = new Date().toISOString() // Current time in ISO format

  const endTime = new Date()
  endTime.setDate(endTime.getDate() + 7) // Add 7 days
  const formattedEndTime = endTime.toISOString() // Convert to ISO format

  try {
    // Execute the insert statement
    const info = insertSessionStmt.run(userId, startTime, formattedEndTime)
    console.log(`Session inserted with ID: ${info.lastInsertRowid}`)
    return {
      id: info.lastInsertRowid,
      endTime
    }
  } catch (error) {
    console.error("Error inserting session:", error)
  }
  return null
}
