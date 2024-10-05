import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "database.db")
const db = new Database(dbPath, { verbose: console.log })

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  `)
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    session_id STRING PRIMARY KEY,
    user_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  );
  `)

export default db
