import { useState, useEffect } from 'react';
import { api } from '../api.js';

const SkillMatrix = ({ user }) => {
  const [empleados, setEmpleados] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

  const getNivelColor = (nivel) => {
    if (nivel >= 4) return 'bg-green-600';
    if (nivel >= 3) return 'bg-blue-600';
    if (nivel >= 2) return 'bg-yellow-500';
    if (nivel >= 1) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  const getNivelTexto = (nivel) => {
    if (nivel >= 4) return 'Experto';
    if (nivel >= 3) return 'Avanzado';
    if (nivel >= 2) return 'Intermedio';
    if (nivel >= 1) return 'Básico';
    return 'Sin certificación';
  };

  const getProcesoStats = () => {
    return procesos.map(proceso => {
      const certificados = empleados.filter(emp => (emp[proceso.id] || 0) >= 3).length;
      const porcentaje = empleados.length > 0 ? Math.round((certificados / empleados.length) * 100) : 0;
      
      return {
        id: proceso.id,
        nombre: proceso.nombre,
        certificados,
        total: empleados.length,
        porcentaje
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-100">Cargando matriz...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">Matriz de Habilidades SMT</h1>
            <p className="text-gray-400">
              Vista completa de certificaciones: {empleados.length} empleados × {procesos.length} procesos
            </p>
          </div>
          {user.rol === 'admin' && (
            <span className="px-4 py-2 bg-yellow-900/30 border-2 border-yellow-600 rounded-full text-yellow-300 text-sm font-semibold">
              Acceso Completo
            </span>
          )}
          {user.rol === 'operador' && (
            <span className="px-4 py-2 bg-blue-900/30 border-2 border-blue-600 rounded-full text-blue-300 text-sm font-semibold">
              Vista de Operador
            </span>
          )}
          {user.rol === 'guest' && (
            <span className="px-4 py-2 bg-gray-700/50 border-2 border-gray-500 rounded-full text-gray-300 text-sm font-semibold">
              Solo Lectura
            </span>
          )}
        </div>
      </div>

      {empleados.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-lg p-12 border border-gray-700 text-center">
          <div className="text-gray-400 text-lg">No hay empleados registrados</div>
        </div>
      ) : (
        <>
          {/* Resumen por Proceso */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Resumen de Cobertura por Proceso</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="text-left p-3 text-sm font-semibold text-gray-200 border-b border-gray-600">
                      Proceso
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-200 border-b border-gray-600">
                      Certificados
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-200 border-b border-gray-600">
                      Total
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-200 border-b border-gray-600">
                      %
                    </th>
                    <th className="text-center p-3 text-sm font-semibold text-gray-200 border-b border-gray-600 min-w-[200px]">
                      Cobertura
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getProcesoStats().map((proceso, idx) => (
                    <tr key={proceso.id} className={`${
                      proceso.certificados <= 2 ? 'bg-red-900/30' :
                      proceso.certificados <= 5 ? 'bg-yellow-900/30' :
                      'bg-green-900/30'
                    } hover:bg-gray-650 transition-colors`}>
                      <td className="p-3 text-sm text-gray-200 border-b border-gray-700">
                        {proceso.nombre.replace(/\n/g, ' ')}
                      </td>
                      <td className="p-3 text-center border-b border-gray-700">
                        <span className={`inline-block px-2 py-1 rounded text-sm font-bold ${
                          proceso.certificados <= 2 ? 'bg-red-600 text-red-100' :
                          proceso.certificados <= 5 ? 'bg-yellow-600 text-yellow-100' :
                          'bg-green-600 text-green-100'
                        }`}>
                          {proceso.certificados}
                        </span>
                      </td>
                      <td className="p-3 text-center text-sm text-gray-300 border-b border-gray-700">
                        {proceso.total}
                      </td>
                      <td className="p-3 text-center text-sm font-semibold text-gray-200 border-b border-gray-700">
                        {proceso.porcentaje}%
                      </td>
                      <td className="p-3 border-b border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                proceso.porcentaje <= 30 ? 'bg-red-500' :
                                proceso.porcentaje <= 60 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${proceso.porcentaje}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 w-12 text-right">
                            {proceso.certificados}/{proceso.total}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span className="text-gray-400">Crítico (≤2)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-600"></div>
                <span className="text-gray-400">Moderado (3-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-600"></div>
                <span className="text-gray-400">Óptimo (&gt;5)</span>
              </div>
            </div>
          </div>

          {/* Matriz Completa (Vista simplificada) */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Matriz Empleado-Proceso</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="sticky left-0 z-10 bg-gray-700 p-2 text-left text-gray-200 border border-gray-600">
                      Empleado
                    </th>
                    {procesos.map((proceso) => (
                      <th
                        key={proceso.id}
                        className="p-2 text-center text-gray-200 border border-gray-600 min-w-[100px]"
                        title={proceso.nombre}
                      >
                        <div className="text-xs leading-tight">
                          {proceso.nombre.split('\n')[0]}
                        </div>
                      </th>
                    ))}
                    <th className="p-2 text-center text-gray-200 border border-gray-600 min-w-[80px]">
                      Total Cert.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((empleado) => {
                    const totalCert = procesos.filter(p => (empleado[p.id] || 0) >= 3).length;
                    return (
                      <tr key={empleado.id} className="hover:bg-gray-700 transition-colors">
                        <td className="sticky left-0 z-10 bg-gray-800 hover:bg-gray-700 p-2 border border-gray-600">
                          <div className="font-medium text-gray-100 whitespace-nowrap">
                            {empleado.nombre}
                          </div>
                          <div className="text-xs text-gray-400">No. {empleado.nde}</div>
                        </td>
                        {procesos.map((proceso) => {
                          const nivel = empleado[proceso.id] || 0;
                          return (
                            <td
                              key={proceso.id}
                              className="p-2 text-center border border-gray-600 cursor-pointer hover:opacity-75"
                              onClick={() => {
                                setSelectedEmpleado({ ...empleado, proceso: proceso.nombre, nivel });
                                setShowDetailsModal(true);
                              }}
                            >
                              <div
                                className={`${getNivelColor(nivel)} text-white font-bold rounded px-2 py-1 inline-block min-w-[40px]`}
                              >
                                {nivel}
                              </div>
                            </td>
                          );
                        })}
                        <td className="p-2 text-center border border-gray-600 font-bold">
                          <span className={`px-3 py-1 rounded ${
                            totalCert <= 2 ? 'bg-red-600 text-red-100' :
                            totalCert <= 10 ? 'bg-yellow-600 text-yellow-100' :
                            'bg-green-600 text-green-100'
                          }`}>
                            {totalCert}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de detalles */}
      {showDetailsModal && selectedEmpleado && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-blue-400">Detalle de Certificación</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedEmpleado(null);
                }}
                className="text-gray-400 hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Empleado</div>
                <div className="text-lg font-semibold text-gray-100">{selectedEmpleado.nombre}</div>
                <div className="text-sm text-gray-400">No. {selectedEmpleado.nde}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400">Proceso</div>
                <div className="text-gray-100">{selectedEmpleado.proceso}</div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Nivel de Certificación</div>
                <div className="flex items-center gap-3">
                  <div className={`${getNivelColor(selectedEmpleado.nivel)} text-white font-bold text-3xl rounded-lg px-6 py-3`}>
                    {selectedEmpleado.nivel}/4
                  </div>
                  <div className="text-lg font-semibold text-gray-100">
                    {getNivelTexto(selectedEmpleado.nivel)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMatrix;
