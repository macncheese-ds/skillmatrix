<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Empleados - PHP MySQL Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .info {
            background: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #667eea;
            margin: 20px;
        }
        .info h2 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .info ul {
            list-style: none;
            padding-left: 20px;
        }
        .info li {
            padding: 5px 0;
            color: #555;
        }
        .info li strong {
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        tbody tr {
            border-bottom: 1px solid #e0e0e0;
            transition: background 0.2s;
        }
        tbody tr:hover {
            background: #f5f5f5;
        }
        tbody tr:nth-child(even) {
            background: #fafafa;
        }
        tbody tr:nth-child(even):hover {
            background: #f0f0f0;
        }
        td {
            padding: 12px 15px;
            color: #333;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        .badge-warning {
            background: #fff3cd;
            color: #856404;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-card h3 {
            font-size: 2.5em;
            margin-bottom: 5px;
        }
        .stat-card p {
            opacity: 0.9;
            font-size: 1.1em;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            margin: 20px;
            border-radius: 8px;
            border-left: 4px solid #f5c6cb;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        .footer code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🏭 Sistema de Empleados</h1>
            <p>Demostración de PHP + MySQL - Programación del lado del Servidor</p>
        </header>

        <div class="info">
            <h2>📋 Unidad 3.3: Programación del Lado del Servidor con PHP</h2>
            <ul>
                <li><strong>Lenguaje:</strong> PHP (Personal Home Page / Hypertext Preprocessor)</li>
                <li><strong>Base de Datos:</strong> MySQL con extensión MySQLi</li>
                <li><strong>Servidor:</strong> Apache/IIS compatible</li>
                <li><strong>Arquitectura:</strong> Cliente-Servidor tradicional (request-response)</li>
                <li><strong>Propósito:</strong> Demostrar procesamiento server-side y acceso a BD desde PHP</li>
            </ul>
        </div>

<?php
// Unidad 3.3: PHP y acceso a bases de datos
// Configuración de conexión MySQL
$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "skills";

// Crear conexión usando MySQLi
$conn = new mysqli($servername, $username, $password, $dbname);

// Configurar charset UTF-8 para caracteres especiales
$conn->set_charset("utf8mb4");

// Verificar conexión
if ($conn->connect_error) {
    echo '<div class="error">';
    echo '<strong>❌ Error de Conexión:</strong> ' . htmlspecialchars($conn->connect_error);
    echo '</div>';
    die();
}

// Consulta SQL para obtener empleados
$sql = "SELECT id, nde, nombre, pos, line, gaveta, fi FROM empleado ORDER BY nde ASC LIMIT 100";
$result = $conn->query($sql);

// Estadísticas
$stats_sql = "SELECT 
    COUNT(*) as total,
    COUNT(DISTINCT line) as lineas,
    COUNT(DISTINCT pos) as posiciones
FROM empleado";
$stats_result = $conn->query($stats_sql);
$stats = $stats_result->fetch_assoc();
?>

        <div class="stats">
            <div class="stat-card">
                <h3><?php echo number_format($stats['total']); ?></h3>
                <p>Empleados Totales</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $stats['lineas']; ?></h3>
                <p>Líneas de Producción</p>
            </div>
            <div class="stat-card">
                <h3><?php echo $stats['posiciones']; ?></h3>
                <p>Posiciones Diferentes</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NDE</th>
                    <th>Nombre Completo</th>
                    <th>Posición</th>
                    <th>Línea</th>
                    <th>Gaveta</th>
                    <th>Fecha Ingreso</th>
                </tr>
            </thead>
            <tbody>
<?php
if ($result->num_rows > 0) {
    // Iterar sobre los resultados
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row['id']) . "</td>";
        echo "<td><strong>" . htmlspecialchars($row['nde']) . "</strong></td>";
        echo "<td>" . htmlspecialchars($row['nombre'] ?? 'N/A') . "</td>";
        echo "<td>" . htmlspecialchars($row['pos'] ?? 'N/A') . "</td>";
        echo "<td>" . htmlspecialchars($row['line'] ?? 'N/A') . "</td>";
        echo "<td>" . htmlspecialchars($row['gaveta'] ?? 'N/A') . "</td>";
        
        // Formatear fecha de ingreso
        $fecha = $row['fi'] ? date('d/m/Y', strtotime($row['fi'])) : 'N/A';
        echo "<td>" . $fecha . "</td>";
        echo "</tr>";
    }
} else {
    echo '<tr><td colspan="7" style="text-align:center; padding: 40px; color: #999;">No se encontraron empleados</td></tr>';
}
?>
            </tbody>
        </table>

        <div class="footer">
            <p>
                <strong>Tecnologías utilizadas:</strong> 
                <code>PHP <?php echo phpversion(); ?></code> | 
                <code>MySQL <?php echo $conn->server_info; ?></code> | 
                <code>MySQLi Extension</code>
            </p>
            <p style="margin-top: 10px;">
                Conexión exitosa a <code><?php echo $dbname; ?></code> en 
                <code><?php echo $servername; ?></code>
            </p>
            <p style="margin-top: 10px; font-size: 0.85em; opacity: 0.7;">
                Este módulo PHP demuestra la programación del lado del servidor (Unidad 3.3) 
                con acceso directo a MySQL, procesamiento server-side y generación dinámica de HTML.
            </p>
        </div>
    </div>

<?php
// Cerrar conexión
$conn->close();
?>

</body>
</html>
