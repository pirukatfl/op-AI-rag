import { Pool } from "pg"
import dotenv from 'dotenv'
dotenv.config()

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
})
  
async function query(queryText, params) {
  const result = await pool.query(queryText, params)
  return result
}

export default query