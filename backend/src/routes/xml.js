import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Unidad 1.4: XML y XSL - Exportar datos en formato XML
router.get('/empleados/xml', async (req, res) => {
  try {
    const [empleados] = await pool.query('SELECT * FROM empleado ORDER BY nde ASC');
    
    // Generar XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="/xsl/empleados.xsl"?>\n';
    xml += '<empleados>\n';
    
    empleados.forEach(emp => {
      xml += '  <empleado>\n';
      xml += `    <id>${emp.id}</id>\n`;
      xml += `    <nde>${emp.nde}</nde>\n`;
      xml += `    <nombre><![CDATA[${emp.nombre || ''}]]></nombre>\n`;
      xml += `    <posicion><![CDATA[${emp.pos || ''}]]></posicion>\n`;
      xml += `    <linea><![CDATA[${emp.line || ''}]]></linea>\n`;
      xml += `    <gaveta>${emp.gaveta || ''}</gaveta>\n`;
      xml += `    <link><![CDATA[${emp.link || ''}]]></link>\n`;
      xml += `    <fi>${emp.fi || ''}</fi>\n`;
      
      // Agregar skills (op1..op18)
      xml += '    <habilidades>\n';
      for (let i = 1; i <= 18; i++) {
        const skill = emp[`op${i}`];
        if (skill !== null && skill !== undefined) {
          xml += `      <skill id="op${i}" valor="${skill}"/>\n`;
        }
      }
      xml += '    </habilidades>\n';
      xml += '  </empleado>\n';
    });
    
    xml += '</empleados>';
    
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating XML:', error);
    res.status(500).json({ error: 'Error al generar XML' });
  }
});

// Endpoint para exportar procesos en XML
router.get('/procesos/xml', async (req, res) => {
  try {
    const [procesos] = await pool.query(`
      SELECT id, proceso, posicion, line, activo 
      FROM procesos 
      ORDER BY id ASC
    `);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="/xsl/procesos.xsl"?>\n';
    xml += '<procesos>\n';
    
    procesos.forEach(proc => {
      xml += '  <proceso>\n';
      xml += `    <id>${proc.id}</id>\n`;
      xml += `    <nombre><![CDATA[${proc.proceso}]]></nombre>\n`;
      xml += `    <posicion>${proc.posicion}</posicion>\n`;
      xml += `    <linea><![CDATA[${proc.line || ''}]]></linea>\n`;
      xml += `    <activo>${proc.activo ? 'true' : 'false'}</activo>\n`;
      xml += '  </proceso>\n';
    });
    
    xml += '</procesos>';
    
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating XML:', error);
    res.status(500).json({ error: 'Error al generar XML' });
  }
});

// Endpoint para servir XSL stylesheet
router.get('/xsl/:filename', (req, res) => {
  const { filename } = req.params;
  
  if (filename === 'empleados.xsl') {
    const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <title>Lista de Empleados</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Reporte de Empleados (XML/XSL Transform)</h1>
        <table>
          <tr>
            <th>NDE</th>
            <th>Nombre</th>
            <th>Posición</th>
            <th>Línea</th>
            <th>Gaveta</th>
            <th>Skills</th>
          </tr>
          <xsl:for-each select="empleados/empleado">
            <tr>
              <td><xsl:value-of select="nde"/></td>
              <td><xsl:value-of select="nombre"/></td>
              <td><xsl:value-of select="posicion"/></td>
              <td><xsl:value-of select="linea"/></td>
              <td><xsl:value-of select="gaveta"/></td>
              <td>
                <xsl:value-of select="count(habilidades/skill[@valor='1'])"/> activas
              </td>
            </tr>
          </xsl:for-each>
        </table>
        <p>Total empleados: <xsl:value-of select="count(empleados/empleado)"/></p>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
    
    res.set('Content-Type', 'application/xslt+xml');
    res.send(xsl);
  } else if (filename === 'procesos.xsl') {
    const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <title>Lista de Procesos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #2196F3; color: white; }
          .activo { color: green; font-weight: bold; }
          .inactivo { color: red; }
        </style>
      </head>
      <body>
        <h1>Catálogo de Procesos (XML/XSL Transform)</h1>
        <table>
          <tr>
            <th>ID</th>
            <th>Proceso</th>
            <th>Posición</th>
            <th>Línea</th>
            <th>Estado</th>
          </tr>
          <xsl:for-each select="procesos/proceso">
            <tr>
              <td><xsl:value-of select="id"/></td>
              <td><xsl:value-of select="nombre"/></td>
              <td><xsl:value-of select="posicion"/></td>
              <td><xsl:value-of select="linea"/></td>
              <td>
                <xsl:choose>
                  <xsl:when test="activo='true'">
                    <span class="activo">Activo</span>
                  </xsl:when>
                  <xsl:otherwise>
                    <span class="inactivo">Inactivo</span>
                  </xsl:otherwise>
                </xsl:choose>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
    
    res.set('Content-Type', 'application/xslt+xml');
    res.send(xsl);
  } else {
    res.status(404).send('XSL file not found');
  }
});

export default router;
