// backend/seed_data.js
// Script to seed sample data into 'skills' and 'credenciales' databases.
// Usage: node seed_data.js

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool from './src/db.js';
import credentialsPool from './src/credentialsDb.js';

dotenv.config();

async function seed() {
  try {
    console.log('Seeding sample data...');

    // Sample empleados
    const empleados = [
      {
        nde: 100,
        link: '',
        fi: '2020-01-15',
        gaveta: 1,
        nombre: 'Juan Perez',
        pos: 'Operador SMT',
        line: 'Línea A',
        op: 3
      },
      {
        nde: 101,
        link: '',
        fi: '2019-06-20',
        gaveta: 2,
        nombre: 'María López',
        pos: 'Inspector',
        line: 'Línea B',
        op: 5
      },
      {
        nde: 102,
        link: '',
        fi: '2021-03-02',
        gaveta: 3,
        nombre: 'Carlos Sánchez',
        pos: 'Técnico',
        line: 'Línea A',
        op: 2
      },
      {
        nde: 179,
        link: '',
        fi: '2018-11-11',
        gaveta: 4,
        nombre: 'Andrés González',
        pos: 'Líder de línea',
        line: 'Línea C',
        op: 8
      },
      {
        nde: 200,
        link: '',
        fi: '2022-07-01',
        gaveta: 5,
        nombre: 'Sofía Morales',
        pos: 'Operador',
        line: 'Línea B',
        op: 1
      }
    ];

    // Insert empleados (defaults for op1..op18 = 0)
    for (const e of empleados) {
      const cols = ['nde','link','fi','gaveta','nombre','pos','line','op','op1','op2','op3','op4','op5','op6','op7','op8','op9','op10','op11','op12','op13','op14','op15','op16','op17','op18'];
      const placeholders = cols.map(() => '?').join(',');
      const values = cols.map(c => (e[c] !== undefined ? e[c] : 0));
      // Ensure fi is provided as string
      const sql = `INSERT INTO empleado (${cols.join(',')}) VALUES (${placeholders})`;
      await pool.query(sql, values);
    }

    console.log('Inserted sample empleados.');

    // Seed credenciales.users with hashed passwords
    const users = [
      { num_empleado: '179', password: 'secret123', nombre: 'Andrés González', rol: 'ADMINISTRADOR' },
      { num_empleado: '100', password: 'password123', nombre: 'Juan Perez', rol: 'OPERADOR' },
      { num_empleado: '101', password: 'password123', nombre: 'María López', rol: 'LIDER' },
      { num_empleado: '102', password: 'password123', nombre: 'Carlos Sánchez', rol: 'OPERADOR' }
    ];

    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      // Insert or update
      await credentialsPool.query(
        `INSERT INTO users (num_empleado, pass_hash, nombre, rol) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE pass_hash = VALUES(pass_hash), nombre = VALUES(nombre), rol = VALUES(rol)`,
        [u.num_empleado, Buffer.from(hash), u.nombre, u.rol]
      );
    }

    console.log('Inserted sample credential users.');

    // Ensure there is an admin user in skills.users (used by backend dev seed)
    const adminHash = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (username, pass_hash, rol, nombre) VALUES ('admin', ?, 'admin', 'Administrador')
       ON DUPLICATE KEY UPDATE pass_hash = VALUES(pass_hash), rol = VALUES(rol), nombre = VALUES(nombre)`,
      [Buffer.from(adminHash)]
    );

    console.log('Ensured admin user in skills.users (username=admin, password=admin123).');

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    try { await pool.end(); } catch(e){}
    try { await credentialsPool.end(); } catch(e){}
    process.exit(0);
  }
}

seed();
