import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function fixEncoding() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.CRED_DB_NAME || 'credenciales',
    charset: 'utf8mb4'
  });

  try {
    console.log('Cambiando charset de la base de datos...');
    
    // Cambiar charset de la base de datos
    await connection.query(
      `ALTER DATABASE ${process.env.CRED_DB_NAME || 'credenciales'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log('✓ Database charset actualizado');

    // Cambiar charset de la tabla
    await connection.query(
      'ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );
    console.log('✓ Table charset actualizado');

    // Verificar los datos después del cambio
    const [users] = await connection.query('SELECT num_empleado, nombre FROM users LIMIT 5');
    console.log('\nUsuarios después de la conversión:');
    users.forEach(user => {
      console.log(`${user.num_empleado}: ${user.nombre}`);
    });

    console.log('\n¡Conversión completada! Reinicia el backend.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

fixEncoding();
