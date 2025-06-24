import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config()

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT, 
});

export default pool;
