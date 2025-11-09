import { useState, useEffect } from 'react';
import { api } from '../api.js';

const Dashboard = ({ user, setActiveTab, navigate }) => {
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    totalProcesos: 0,
    certificacionesAvanzadas: 0,
    promedioNivel: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener empleados
      const empleados = await api.get('/empleados');
      
      // Obtener procesos
      const procesos = await api.get('/procesos');
      
      // Calcular estadísticas
      let totalCertificaciones = 0;
      let sumaTotal = 0;
      let cantidadTotal = 0;
      
      empleados.forEach(emp => {
        procesos.forEach(proc => {
          const nivel = emp[proc.id] || 0;
          if (nivel >= 3) totalCertificaciones++;
          sumaTotal += nivel;
          cantidadTotal++;
        });
      });
      
      const promedioNivel = cantidadTotal > 0 ? (sumaTotal / cantidadTotal).toFixed(2) : 0;
      
      setStats({
        totalEmpleados: empleados.length,
        totalProcesos: procesos.length,
        certificacionesAvanzadas: totalCertificaciones,
        promedioNivel: promedioNivel
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-100">Cargando dashboard...</div>
      </div>
    );
  }

  // Obtener badge y color según rol - Paleta corporativa
  const getRoleBadge = () => {
    switch(user.rol) {
      case 'admin':
        return { text: 'Administrador', color: 'from-slate-700 to-slate-900', bgColor: 'bg-slate-800/30 border-slate-600' };
      case 'operador':
        return { text: 'Operador', color: 'from-blue-800 to-blue-950', bgColor: 'bg-blue-900/30 border-blue-700' };
      default:
        return { text: 'Invitado', color: 'from-gray-700 to-gray-900', bgColor: 'bg-gray-800/30 border-gray-600' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className={`bg-gradient-to-r ${roleBadge.color} rounded-lg shadow-lg p-8 text-white`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {getGreeting()}, {user.nombre}!
              </h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${roleBadge.bgColor}`}>
                {roleBadge.text}
              </span>
            </div>
            <p className={`${user.rol === 'admin' ? 'text-slate-200' : user.rol === 'operador' ? 'text-blue-200' : 'text-gray-300'} text-lg`}>
              {user.rol === 'admin' && 'Tienes acceso completo al sistema'}
              {user.rol === 'operador' && 'Puedes consultar y gestionar empleados'}
              {user.rol === 'guest' && 'Puedes consultar la información del sistema'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-sm ${user.rol === 'admin' ? 'text-slate-200' : user.rol === 'operador' ? 'text-blue-200' : 'text-gray-300'}`}>
              Fecha de hoy
            </div>
            <div className="text-xl font-semibold">
              {new Date().toLocaleDateString('es-MX', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Empleados */}
        <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium mb-2">Total Empleados</p>
              <p className="text-4xl font-bold">{stats.totalEmpleados}</p>
            </div>
            <div className="bg-teal-800 bg-opacity-50 rounded-full p-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-teal-100 text-sm">
            {user.rol === 'admin' ? 'Personal registrado en el sistema' : 'Empleados en el sistema'}
          </div>
        </div>

        {/* Total Procesos */}
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-2">Total Procesos</p>
              <p className="text-4xl font-bold">{stats.totalProcesos}</p>
            </div>
            <div className="bg-indigo-800 bg-opacity-50 rounded-full p-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-indigo-100 text-sm">
            Procesos SMT disponibles
          </div>
        </div>

        {/* Certificaciones Avanzadas */}
        <div className="bg-gradient-to-br from-cyan-700 to-cyan-900 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium mb-2">Cert. Avanzadas</p>
              <p className="text-4xl font-bold">{stats.certificacionesAvanzadas}</p>
            </div>
            <div className="bg-cyan-800 bg-opacity-50 rounded-full p-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-cyan-100 text-sm">
            Nivel 3 (Avanzado) o superior
          </div>
        </div>

        {/* Promedio General */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm font-medium mb-2">Promedio Nivel</p>
              <p className="text-4xl font-bold">{stats.promedioNivel}</p>
            </div>
            <div className="bg-slate-800 bg-opacity-50 rounded-full p-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-slate-200 text-sm">
            Nivel promedio de todas las habilidades
          </div>
        </div>
      </div>

      {/* Secciones adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accesos Rápidos */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Accesos Rápidos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => { if (setActiveTab) setActiveTab('matriz'); }}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-left">
              <div className="font-semibold mb-1">Ver Matriz Completa</div>
              <div className="text-sm text-blue-200">Consultar habilidades</div>
            </button>
            
            {/* Solo para admin y operador */}
            {(user.rol === 'admin' || user.rol === 'operador') && (
              <button
                onClick={() => { if (setActiveTab) setActiveTab('empleados'); }}
                className="bg-teal-700 hover:bg-teal-800 text-white p-4 rounded-lg transition-colors text-left">
                <div className="font-semibold mb-1">Gestionar Empleados</div>
                <div className="text-sm text-teal-100">Agregar o editar</div>
              </button>
            )}
            
            {/* Solo para admin */}
            {user.rol === 'admin' && (
              <>
                <button
                  onClick={() => { if (setActiveTab) setActiveTab('reportes'); }}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white p-4 rounded-lg transition-colors text-left">
                  <div className="font-semibold mb-1">Ver Reportes</div>
                  <div className="text-sm text-indigo-100">Análisis y gráficas</div>
                </button>
                <button
                  onClick={() => {
                    // Exportar: navigate to reportes and (future) trigger export
                    if (setActiveTab) setActiveTab('reportes');
                  }}
                  className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-lg transition-colors text-left">
                  <div className="font-semibold mb-1">Exportar Datos</div>
                  <div className="text-sm text-slate-200">Descargar información</div>
                </button>
              </>
            )}
            
            {/* Para invitado - opciones limitadas */}
            {user.rol === 'guest' && (
              <>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg transition-colors text-left opacity-75">
                  <div className="font-semibold mb-1">Vista de Lectura</div>
                  <div className="text-sm text-gray-300">Solo consulta</div>
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg transition-colors text-left opacity-75">
                  <div className="font-semibold mb-1">Acceso Limitado</div>
                  <div className="text-sm text-gray-300">Sin permisos de edición</div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Información del Sistema */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Información del Sistema
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <div>
                <div className="text-gray-100 font-medium">Gestión de Habilidades</div>
                <div className="text-gray-400 text-sm">Sistema completo para registrar y consultar certificaciones de empleados en procesos SMT</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-400 font-bold">2</span>
              </div>
              <div>
                <div className="text-gray-100 font-medium">Niveles de Certificación</div>
                <div className="text-gray-400 text-sm">4 niveles: Básico (1), Intermedio (2), Avanzado (3), Experto (4)</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <div>
                <div className="text-gray-100 font-medium">Reportes y Análisis</div>
                <div className="text-gray-400 text-sm">Visualiza estadísticas, gráficas y métricas de desempeño del equipo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
