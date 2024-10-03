import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "database.db")
const db = new Database(dbPath, { verbose: console.log })

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`
).run()

export default db
