import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkEncoding() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.CRED_DB_NAME || 'credenciales',
    charset: 'utf8mb4'
  });

  try {
    // Verificar charset de la base de datos
    const [dbCharset] = await connection.query(
      "SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?",
      [process.env.CRED_DB_NAME || 'credenciales']
    );
    console.log('Database charset:', dbCharset);

    // Verificar charset de la tabla users
    const [tableCharset] = await connection.query(
      "SELECT TABLE_NAME, TABLE_COLLATION FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'",
      [process.env.CRED_DB_NAME || 'credenciales']
    );
    console.log('Table charset:', tableCharset);

    // Verificar charset de la columna nombre
    const [columnCharset] = await connection.query(
      "SELECT COLUMN_NAME, CHARACTER_SET_NAME, COLLATION_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'nombre'",
      [process.env.CRED_DB_NAME || 'credenciales']
    );
    console.log('Column charset:', columnCharset);

    // Obtener datos actuales
    const [users] = await connection.query('SELECT num_empleado, nombre, HEX(nombre) as hex_nombre FROM users LIMIT 5');
    console.log('\nUsuarios actuales:');
    users.forEach(user => {
      console.log(`${user.num_empleado}: ${user.nombre}`);
      console.log(`  HEX: ${user.hex_nombre}\n`);
    });

    // Verificar si necesitamos convertir
    console.log('\n¿Los nombres se ven correctamente arriba? Si no, ejecuta fix_encoding.js');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkEncoding();
