<%@ Language=VBScript %>
<%
' ASP clásico: Conexión a MySQL y mostrar empleados
Dim conn, rs, sql
Set conn = Server.CreateObject("ADODB.Connection")
conn.Open "Driver={MySQL ODBC 8.0 Unicode Driver};Server=localhost;Database=skills;User=root;Password=1234;Option=3;"

sql = "SELECT id, nde, nombre, pos, line FROM empleado ORDER BY nde ASC LIMIT 10"
Set rs = conn.Execute(sql)
%>
<html>
<head>
  <title>Empleados - ASP Demo</title>
  <style>
    body { font-family: Arial; background: #f5f5f5; }
    table { border-collapse: collapse; width: 60%; margin: 20px 0; }
    th, td { border: 1px solid #888; padding: 8px 12px; }
    th { background: #ede7f6; color: #4a148c; }
    tr:nth-child(even) { background: #f3e5f5; }
  </style>
</head>
<body>
  <h1>Empleados (ASP clásico)</h1>
  <table>
    <tr><th>ID</th><th>NDE</th><th>Nombre</th><th>Posición</th><th>Línea</th></tr>
    <% Do Until rs.EOF %>
      <tr>
        <td><%=rs("id")%></td>
        <td><%=rs("nde")%></td>
        <td><%=rs("nombre")%></td>
        <td><%=rs("pos")%></td>
        <td><%=rs("line")%></td>
      </tr>
      <% rs.MoveNext %>
    <% Loop %>
  </table>
  <p>Este archivo demuestra ASP clásico con conexión a MySQL.</p>
</body>
</html>
<%
rs.Close
Set rs = Nothing
conn.Close
Set conn = Nothing
%>
