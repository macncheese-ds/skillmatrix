// backend/generate_empleados.js
// Generate sample rows for the `empleado` table.
// Usage: node generate_empleados.js [count]

import dotenv from 'dotenv';
import pool from './src/db.js';
dotenv.config();

const FIRST = ['Juan','María','Carlos','Ana','Luis','Sofía','Andrés','Pablo','Laura','Miguel','Jose','Lucía','Fernando','Marta','Diego','Isabel','Jorge','Carmen','Raúl','Rosa'];
const LAST = ['García','López','González','Pérez','Rodríguez','Martínez','Sánchez','Romero','Torres','Ramírez','Flores','Rivera','Gutiérrez','Ortiz','Vargas'];
const POS = ['Operador','Inspector','Técnico','Líder de línea','Ingeniero','Supervisor','Auxiliar'];
const LINES = ['Línea A','Línea B','Línea C','Línea D'];

function randInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }
function rnd(arr){ return arr[randInt(0, arr.length-1)]; }
function randomDate(startYear=2016,endYear=2024){
  const year = randInt(startYear,endYear);
  const month = randInt(1,12);
  const day = randInt(1,28);
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

async function main(){
  const arg = process.argv[2];
  const count = arg ? parseInt(arg,10) : 100;
  if (!count || count<=0) {
    console.error('Provide a positive integer count, e.g. node generate_empleados.js 200');
    process.exit(1);
  }

  console.log(`Generating ${count} empleados...`);

  // Find max existing nde to avoid duplicates
  let startNde = 1000;
  try {
    const [rows] = await pool.query('SELECT MAX(nde) as maxnde FROM empleado');
    if (rows && rows.length && rows[0].maxnde) startNde = rows[0].maxnde + 1;
  } catch(e){
    console.warn('Could not read max nde, using default start 1000', e.message);
  }

  for (let i=0;i<count;i++){
    const nde = startNde + i;
    const nombre = `${rnd(FIRST)} ${rnd(LAST)}`;
    const pos = rnd(POS);
    const line = rnd(LINES);
    const fi = randomDate(2016,2024);
    const link = '';
    const gaveta = randInt(1,50);
    // generate op..op18 values small 0-5
    const ops = Array.from({length:19}, ()=>randInt(0,5));

    const cols = ['nde','link','fi','gaveta','nombre','pos','line','op','op1','op2','op3','op4','op5','op6','op7','op8','op9','op10','op11','op12','op13','op14','op15','op16','op17','op18'];
    const placeholders = cols.map(()=>'?').join(',');
    const values = [nde, link, fi, gaveta, nombre, pos, line, ...ops];

    try {
      await pool.query(`INSERT INTO empleado (${cols.join(',')}) VALUES (${placeholders})`, values);
      if ((i+1) % 50 === 0) console.log(`Inserted ${i+1} / ${count}`);
    } catch(err){
      console.error('Insert error at', i, err.message);
    }
  }

  console.log('Done.');
  try { await pool.end(); } catch(e){}
  process.exit(0);
}

main().catch(e=>{ console.error(e); process.exit(1); });
