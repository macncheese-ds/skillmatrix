// backend/create_user.js
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const num_empleado = '179'; // ajusta
const plainPassword = 'secret123'; // ajusta
const nombre = 'Admin ejemplo';
const rol = 'ADMINISTRADOR'; // auth.js mapRole -> 'admin'

async function run() {
  const hash = await bcrypt.hash(plainPassword, 10);
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.CRED_DB_NAME || 'credenciales',
  });

  const sql = `INSERT INTO users (num_empleado, pass_hash, nombre, rol) VALUES (?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE pass_hash = VALUES(pass_hash), nombre = VALUES(nombre), rol = VALUES(rol)`;
  await conn.execute(sql, [num_empleado, Buffer.from(hash), nombre, rol]);
  console.log('Usuario creado/actualizado:', num_empleado);
  await conn.end();
}

run().catch(e => { console.error(e); process.exit(1); });