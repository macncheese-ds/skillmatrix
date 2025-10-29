import { useState, useEffect } from 'react';
import { api } from '../api.js';

const Reportes = ({ user }) => {
  const [empleados, setEmpleados] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('procesos'); // 'procesos' o 'empleados'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empleadosData, procesosData] = await Promise.all([
        api.get('/empleados'),
        api.get('/procesos')
      ]);
      setEmpleados(empleadosData);
      setProcesos(procesosData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProcesoStats = () => {
    return procesos.map(proceso => {
      const certificados = empleados.filter(emp => (emp[proceso.id] || 0) >= 3).length;
      const porcentaje = empleados.length > 0 ? Math.round((certificados / empleados.length) * 100) : 0;
      
      return {
        id: proceso.id,
        nombre: proceso.nombre.replace(/\n/g, ' '),
        certificados,
        total: empleados.length,
        porcentaje,
        expertos: empleados.filter(emp => (emp[proceso.id] || 0) === 4).length,
        avanzados: empleados.filter(emp => (emp[proceso.id] || 0) === 3).length,
        intermedios: empleados.filter(emp => (emp[proceso.id] || 0) === 2).length,
        basicos: empleados.filter(emp => (emp[proceso.id] || 0) === 1).length
      };
    }).sort((a, b) => a.porcentaje - b.porcentaje);
  };

  const getEmpleadoStats = () => {
    return empleados.map(empleado => {
      const certificaciones = {
        experto: 0,
        avanzado: 0,
        intermedio: 0,
        basico: 0
      };
      
      procesos.forEach(proceso => {
        const nivel = empleado[proceso.id] || 0;
        if (nivel === 4) certificaciones.experto++;
        else if (nivel === 3) certificaciones.avanzado++;
        else if (nivel === 2) certificaciones.intermedio++;
        else if (nivel === 1) certificaciones.basico++;
      });
      
      const totalCertificaciones = certificaciones.experto + certificaciones.avanzado;
      
      return {
        ...empleado,
        certificaciones,
        totalCertificaciones,
        porcentaje: procesos.length > 0 ? Math.round((totalCertificaciones / procesos.length) * 100) : 0
      };
    }).sort((a, b) => b.totalCertificaciones - a.totalCertificaciones);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-100">Cargando reportes...</div>
      </div>
    );
  }

  const procesoStats = getProcesoStats();
  const empleadoStats = getEmpleadoStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h1 className="text-2xl font-bold text-gray-100 mb-4">Reportes y Análisis</h1>
        
        {/* Selector de tipo de reporte */}
        <div className="flex gap-4">
          <button
            onClick={() => setReportType('procesos')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              reportType === 'procesos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Por Procesos
          </button>
          <button
            onClick={() => setReportType('empleados')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              reportType === 'empleados'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Por Empleados
          </button>
        </div>
      </div>

      {/* Reporte por Procesos */}
      {reportType === 'procesos' && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Cobertura por Proceso</h2>
          <div className="space-y-4">
            {procesoStats.map((proceso) => (
              <div key={proceso.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-100 font-medium">{proceso.nombre}</h3>
                    <div className="text-sm text-gray-400 mt-1">
                      {proceso.certificados} de {proceso.total} empleados ({proceso.porcentaje}%)
                    </div>
                  </div>
                  <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                    proceso.porcentaje >= 70 ? 'bg-green-900 text-green-300' :
                    proceso.porcentaje >= 40 ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {proceso.porcentaje}%
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="relative w-full h-6 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                      proceso.porcentaje >= 70 ? 'bg-green-500' :
                      proceso.porcentaje >= 40 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${proceso.porcentaje}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    {proceso.certificados}/{proceso.total}
                  </div>
                </div>

                {/* Desglose por niveles */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-green-900/30 border border-green-700 rounded px-2 py-1 text-green-300 text-center">
                    Experto: {proceso.expertos}
                  </div>
                  <div className="bg-blue-900/30 border border-blue-700 rounded px-2 py-1 text-blue-300 text-center">
                    Avanzado: {proceso.avanzados}
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded px-2 py-1 text-yellow-300 text-center">
                    Intermedio: {proceso.intermedios}
                  </div>
                  <div className="bg-orange-900/30 border border-orange-700 rounded px-2 py-1 text-orange-300 text-center">
                    Básico: {proceso.basicos}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reporte por Empleados */}
      {reportType === 'empleados' && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Ranking de Empleados</h2>
          <div className="space-y-4">
            {empleadoStats.map((empleado, index) => (
              <div key={empleado.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center gap-4">
                  {/* Ranking */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                    index === 0 ? 'bg-yellow-600 text-yellow-100' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-700 text-orange-100' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Foto */}
                  <div className="flex-shrink-0">
                    {empleado.link ? (
                      <img
                        src={empleado.link}
                        alt={empleado.nombre}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 border-2 border-gray-500"
                      style={empleado.link ? { display: 'none' } : {}}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-100 font-semibold text-lg truncate">{empleado.nombre}</h3>
                    <div className="text-sm text-gray-400">
                      No. {empleado.nde} - {empleado.pos}
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-blue-400">{empleado.totalCertificaciones}</div>
                    <div className="text-xs text-gray-400">certificaciones</div>
                  </div>
                </div>

                {/* Desglose de certificaciones */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-green-900/30 border border-green-700 rounded px-3 py-2 text-green-300">
                    <div className="font-semibold text-lg">{empleado.certificaciones.experto}</div>
                    <div>Experto</div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-700 rounded px-3 py-2 text-blue-300">
                    <div className="font-semibold text-lg">{empleado.certificaciones.avanzado}</div>
                    <div>Avanzado</div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-700 rounded px-3 py-2 text-yellow-300">
                    <div className="font-semibold text-lg">{empleado.certificaciones.intermedio}</div>
                    <div>Intermedio</div>
                  </div>
                  <div className="bg-orange-900/30 border border-orange-700 rounded px-3 py-2 text-orange-300">
                    <div className="font-semibold text-lg">{empleado.certificaciones.basico}</div>
                    <div>Básico</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reportes;
