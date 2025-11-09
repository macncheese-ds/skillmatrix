// Ejemplo de microservicio Node.js para arquitectura N-capas/procesos distribuidos
// Ejecutar: node microservice.js
const express = require('express');
const app = express();
const PORT = 6000;

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', service: 'microservice', ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Microservicio escuchando en http://localhost:${PORT}/api/ping`);
});
