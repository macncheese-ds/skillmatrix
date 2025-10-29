import http from 'http';

async function testLookup() {
  try {
    const response = await new Promise((resolve, reject) => {
      http.get('http://10.229.52.220:5000/api/auth/lookup/184A', (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) }));
        res.on('error', reject);
      });
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('\nDatos recibidos:');
    console.log('Nombre:', response.data.nombre);
    console.log('Num empleado:', response.data.num_empleado);
    console.log('Rol:', response.data.rol);
    
    // Mostrar en hexadecimal para ver si hay problemas de encoding
    const nombreHex = Buffer.from(response.data.nombre, 'utf8').toString('hex');
    console.log('\nNombre en hexadecimal:', nombreHex);
    
    // Mostrar caracteres uno por uno
    console.log('\nCaracteres del nombre:');
    for (let i = 0; i < response.data.nombre.length; i++) {
      const char = response.data.nombre[i];
      const code = response.data.nombre.charCodeAt(i);
      console.log(`${i}: '${char}' (U+${code.toString(16).toUpperCase().padStart(4, '0')})`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testLookup();
