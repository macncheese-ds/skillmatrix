import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function findAndres() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.CRED_DB_NAME || 'credenciales',
    charset: 'utf8mb4'
  });

  try {
    const [users] = await connection.query('SELECT num_empleado, nombre FROM users WHERE nombre LIKE ?', ['%Andr%']);
    console.log('Usuarios con "Andr" en el nombre:');
    users.forEach(user => {
      console.log(`${user.num_empleado}: ${user.nombre}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

findAndres();
