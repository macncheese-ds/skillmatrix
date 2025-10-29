import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const credentialsPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.CRED_DB_NAME || 'credenciales',
  connectionLimit: 10,
  namedPlaceholders: true,
  charset: 'utf8mb4'
});

export default credentialsPool;
