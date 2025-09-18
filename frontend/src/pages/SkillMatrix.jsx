import { useState, useEffect } from 'react';
import { api, setAuthToken } from '../api.js';
import EmpleadoForm from './EmpleadoForm.jsx';

const SkillMatrix = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [currentView, setCurrentView] = useState('resumen'); // 'resumen' o 'detalle'
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);

  // Nombres de las operaciones según la imagen
  const operaciones = [
    { id: 'op', nombre: 'Process 10/110\nBottom/Top PCB Loading' },
    { id: 'op1', nombre: 'Process 20/120\nBottom/Top Laser Marking' },
    { id: 'op2', nombre: 'Process 30/130\nBottom/Top Solder Paste Printing' },
    { id: 'op3', nombre: 'Process 40/140\nBottom/Top Solder Paste Inspection (SPI)' },
    { id: 'op4', nombre: 'Process 50/150\nBottom/Top SMD Placement' },
    { id: 'op5', nombre: 'Process 55/155\nBottom/Top Auto Optical Inspection (Pre AOI)' },
    { id: 'op6', nombre: 'Process 60/160\nBottom/Top Reflow Soldering' },
    { id: 'op7', nombre: 'Process 70/170\nBottom/Top Auto Optical Inspection (Post AOI)' },
    { id: 'op8', nombre: 'Process 80/180\nBottom/Top Sideviewer' },
    { id: 'op9', nombre: 'Process 185\nBottom Inspection' },
    { id: 'op10', nombre: 'Process 90/190\nBottom/Top Unloading' },
    { id: 'op11', nombre: 'Process 195\nBottom & Top Side 3D X-ray Inspection' },
    { id: 'op12', nombre: 'Process 200\nEtiquetado' },
    { id: 'op13', nombre: 'Process\nViscosimetro' },
    { id: 'op14', nombre: 'Process\nBatidora de Pasta' },
    { id: 'op15', nombre: 'Process\nSoldadura' },
    { id: 'op16', nombre: 'Process\nLavadora de Stenciles' },
    { id: 'op17', nombre: 'Process\nMantenimiento Preventivo' },
    { id: 'op18', nombre: 'Process\nCalibración' }
  ];

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const data = await api.get('/empleados');
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching empleados:', error);
      setError('Error al cargar los empleados');
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirmation = (empleado) => {
    if (!editMode) return;
    setEmpleadoToDelete(empleado);
    setShowDeleteModal(true);
  };

  const deleteEmpleado = async () => {
    if (!empleadoToDelete) return;
    try {
      await api.delete(`/empleados/${empleadoToDelete.id}`);
      await fetchEmpleados();
      setShowDeleteModal(false);
      setEmpleadoToDelete(null);
    } catch (error) {
      console.error('Error deleting empleado:', error);
      alert('Error al eliminar el empleado');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setEmpleadoToDelete(null);
  };

  // Función para obtener el color de fondo basado en el nivel
  const getBgColor = (value) => {
    if (value >= 4) return 'bg-green-600'; // Experto
    if (value >= 3) return 'bg-blue-600';  // Avanzado
    if (value >= 2) return 'bg-yellow-500'; // Intermedio
    if (value >= 1) return 'bg-orange-500'; // Básico
    return 'bg-gray-300'; // Sin certificación
  };

  // Función para obtener el texto del nivel
  const getNivelTexto = (value) => {
    if (value >= 4) return 'Experto';
    if (value >= 3) return 'Avanzado';
    if (value >= 2) return 'Intermedio';
    if (value >= 1) return 'Básico';
    return 'Sin certificación';
  };

  // Función para obtener el color del contador según el número de certificaciones
  const getCounterColor = (count) => {
    if (count <= 2) return 'bg-red-900 text-red-300 border-red-700';
    if (count <= 10) return 'bg-yellow-900 text-yellow-300 border-yellow-700';
    return 'bg-green-900 text-green-300 border-green-700';
  };

  // Función para calcular resumen de procesos
  const getProcessSummary = () => {
    if (!empleados || empleados.length === 0) return [];
    
    return operaciones.map((op) => {
      const empleadosConCertificacion = empleados.filter(emp => emp[op.id] > 2).length;
      return {
        id: op.id,
        nombre: op.nombre,
        totalCertificados: empleadosConCertificacion,
        totalEmpleados: empleados.length,
        porcentaje: empleados.length > 0 ? Math.round((empleadosConCertificacion / empleados.length) * 100) : 0
      };
    });
  };

  // Función para contar certificaciones avanzadas/expertas de un empleado
  const getCertificacionesAvanzadas = (empleado) => {
    return operaciones.filter(op => empleado[op.id] >= 3).length;
  };

  // Función para obtener los colores de la tarjeta según el número de certificados
  const getCardColors = (totalCertificados) => {
    if (totalCertificados === 1) {
      return {
        cardClass: "bg-gradient-to-br from-red-800 to-red-900 border border-red-600",
        textColor: "text-red-100",
        numberColor: "text-red-300",
        barColor: "bg-red-500"
      };
    } else if (totalCertificados === 2) {
      return {
        cardClass: "bg-gradient-to-br from-yellow-800 to-yellow-900 border border-yellow-600",
        textColor: "text-yellow-100",
        numberColor: "text-yellow-300",
        barColor: "bg-yellow-500"
      };
    } else {
      return {
        cardClass: "bg-gradient-to-br from-gray-700 to-black border border-gray-600",
        textColor: "text-gray-100",
        numberColor: "text-blue-400",
        barColor: "bg-blue-500"
      };
    }
  };

  // Función para filtrar empleados según la búsqueda
  const filteredEmpleados = (empleados || []).filter(empleado => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return String(empleado.nombre || '').toLowerCase().includes(query) ||
           String(empleado.nde || '').toLowerCase().includes(query) ||
           String(empleado.pos || '').toLowerCase().includes(query) ||
           String(empleado.line || '').toLowerCase().includes(query);
  });

  // Función para manejar la autenticación para modo edición
  const handleEditAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const data = await api.post('/auth/login', { 
        username: authUsername, 
        password: authPassword 
      });
      
      if (data.token) {
        // guardar token para que axios lo incluya en próximas peticiones
        setAuthToken(data.token);
        setEditMode(true);
        setShowAuthModal(false);
        setAuthUsername('');
        setAuthPassword('');
        setCurrentView('detalle'); // Cambiar a vista de empleados automáticamente
      }
    } catch (error) {
      setAuthError('Usuario o contraseña incorrectos');
    }
  };

  // Función para salir del modo edición
  const exitEditMode = () => {
    setEditMode(false);
    setShowForm(false);
    setEditingEmpleado(null);
    // remover token cuando se sale del modo edición
    setAuthToken(null);
  };

  const PieChart = ({ value, size = 32 }) => {
    // Radio del círculo = 14, entonces circumferencia = 2 * π * 14 = 87.96
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    
    // Calcular el porcentaje exacto basado en el valor (0-4)
    const percentage = value / 4;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Círculo de fondo */}
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          {/* Círculo de progreso */}
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="none"
            stroke={value >= 4 ? '#059669' : value >= 3 ? '#2563eb' : value >= 2 ? '#eab308' : value >= 1 ? '#f97316' : '#9ca3af'}
            strokeWidth="4"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.3s ease'
            }}
          />
        </svg>
        {/* Texto del valor */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-100">{value}</span>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 bg-gray-900 min-h-screen">
      <div className="text-lg text-gray-100">Cargando matriz de habilidades...</div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Matriz de Habilidades SMT</h1>
              <p className="text-blue-200 mt-2">
                Gestión de competencias por empleado
                {editMode && <span className="ml-2 bg-green-600 px-2 py-1 rounded text-xs">MODO EDICIÓN</span>}
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-2">
              {!editMode ? (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button 
                    onClick={exitEditMode}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Salir de Edición
                  </button>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    + Agregar Empleado
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Navegación entre vistas */}
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setCurrentView('resumen')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'resumen' 
                  ? 'bg-white text-blue-800' 
                  : 'bg-blue-800 hover:bg-blue-700 text-white border border-blue-600'
              }`}
            >
              📊 Resumen
            </button>
            <button 
              onClick={() => setCurrentView('detalle')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'detalle' 
                  ? 'bg-white text-blue-800' 
                  : 'bg-blue-800 hover:bg-blue-700 text-white border border-blue-600'
              }`}
            >
              👥 Empleados
            </button>
          </div>
        </div>

        {/* Contenido según la vista actual */}
        {currentView === 'resumen' ? (
          /* VISTA RESUMEN */
          <div className="p-6 bg-gray-800">
            <h2 className="text-xl font-semibold mb-6 text-gray-100">Resumen de Procesos SMT</h2>
            
            {(!empleados || empleados.length === 0) ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">
                  No hay empleados registrados en el sistema
                </div>
                {editMode && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    + Agregar Primer Empleado
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
                {getProcessSummary().map((proceso) => {
                  const colors = getCardColors(proceso.totalCertificados);
                  return (
                    <div key={proceso.id} className={`${colors.cardClass} rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow`}>
                      <h3 className={`font-medium text-xs ${colors.textColor} mb-1 leading-tight`}>
                        {proceso.nombre.replace(/\n/g, '\n')}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`${colors.textColor} text-xs`}>Certificados (&gt;2):</span>
                          <span className={`font-bold text-base ${colors.numberColor}`}>
                            {proceso.totalCertificados}/{proceso.totalEmpleados}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div 
                            className={`${colors.barColor} h-1 rounded-full transition-all duration-300`}
                            style={{ width: `${proceso.porcentaje}%` }}
                          ></div>
                        </div>
                        <div className={`text-center text-xs font-medium ${colors.textColor}`}>
                          {proceso.porcentaje}% del equipo
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* VISTA DETALLE */
          <div className="bg-gray-800">
            {(!empleados || empleados.length === 0) ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-lg mb-4">
                  No hay empleados registrados en el sistema
                </div>
                {editMode && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    + Agregar Primer Empleado
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Lista de empleados */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-gray-100">Empleados y Certificaciones</h2>
                    
                    {/* Barra de búsqueda */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar por nombre, No. empleado, posición o línea..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-80 pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Mostrar resultados de búsqueda */}
                  {searchQuery && (
                    <div className="mb-4 text-gray-400 text-sm">
                      {filteredEmpleados.length} empleado(s) encontrado(s) para "{searchQuery}"
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {filteredEmpleados.length === 0 && searchQuery ? (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-lg mb-4">
                          No se encontraron empleados que coincidan con "{searchQuery}"
                        </div>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Limpiar búsqueda
                        </button>
                      </div>
                    ) : (
                      filteredEmpleados.map((empleado) => (
                      <div key={empleado.id}>
                        {/* Fila principal del empleado */}
                        <div 
                          className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-650"
                          onDoubleClick={() => setExpandedEmployee(
                            expandedEmployee === empleado.id ? null : empleado.id
                          )}
                        >
                          <div className={`grid gap-4 items-center ${editMode ? 'grid-cols-8' : 'grid-cols-7'}`}>
                            {/* Foto del empleado */}
                            <div className="flex justify-center">
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
                                className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-xs border-2 border-gray-500"
                                style={empleado.link ? {display: 'none'} : {}}
                              >
                                Sin foto
                              </div>
                            </div>
                            <div className="font-medium text-gray-100">
                              <div className="text-sm text-gray-400">No. Empleado</div>
                              <div className="text-lg">{empleado.nde}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Nombre</div>
                              <div className="font-medium text-gray-100">{empleado.nombre}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Posición</div>
                              <div className="text-gray-200">{empleado.pos}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Línea</div>
                              <div className="text-gray-200">{empleado.line}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Fecha Ingreso</div>
                              <div className="text-gray-200">{new Date(empleado.fi).toLocaleDateString()}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-400">Certificaciones Avanzadas</div>
                              <div className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${getCounterColor(getCertificacionesAvanzadas(empleado))}`}>
                                {getCertificacionesAvanzadas(empleado)}
                              </div>
                            </div>
                            {/* Acciones de edición */}
                            {editMode && (
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => {
                                    setEditingEmpleado(empleado.id);
                                    setShowForm(true);
                                  }}
                                  className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded text-xs"
                                  title="Editar empleado"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => showDeleteConfirmation(empleado)}
                                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded text-xs"
                                  title="Eliminar empleado"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-400 text-center">
                            💡 Doble clic para ver todas las certificaciones
                          </div>
                        </div>

                        {/* Tarjeta expandida con todas las certificaciones */}
                        {expandedEmployee === empleado.id && (
                          <div className="mt-4 bg-gray-900 border border-gray-600 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-semibold text-blue-400">
                                Certificaciones de {empleado.nombre}
                              </h3>
                              <button 
                                onClick={() => setExpandedEmployee(null)}
                                className="text-blue-400 hover:text-blue-300 text-xl font-bold"
                              >
                                ×
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {operaciones.map((op) => (
                                <div 
                                  key={op.id} 
                                  className="bg-gray-800 rounded-lg p-3 border border-gray-600 shadow-sm"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className="text-sm font-medium text-gray-100 mb-2 leading-tight">
                                        {op.nombre.replace(/\\n/g, '\n')}
                                      </h4>
                                    </div>
                                    <div className="ml-3">
                                      <PieChart value={empleado[op.id]} size={40} />
                                    </div>
                                  </div>
                                  <div className="mt-2 text-center">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                      empleado[op.id] >= 4 ? 'bg-green-900 text-green-300 border border-green-700' :
                                      empleado[op.id] >= 3 ? 'bg-blue-900 text-blue-300 border border-blue-700' :
                                      empleado[op.id] >= 2 ? 'bg-yellow-900 text-yellow-300 border border-yellow-700' :
                                      empleado[op.id] >= 1 ? 'bg-orange-900 text-orange-300 border border-orange-700' :
                                      'bg-gray-700 text-gray-300 border border-gray-600'
                                    }`}>
                                      Nivel {empleado[op.id]}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                    )}
                  </div>
                </div>
                

              </>
            )}
          </div>
        )}
      </div>

      {/* Modal de autenticación para modo edición */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Acceso a Modo Edición</h2>
            <form onSubmit={handleEditAuth}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Usuario"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  required
                />
                {authError && <div className="text-red-400 text-sm">{authError}</div>}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal(false);
                      setAuthUsername('');
                      setAuthPassword('');
                      setAuthError('');
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && empleadoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-100">Confirmar Eliminación</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">¿Estás seguro de que quieres eliminar al empleado?</p>
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  {empleadoToDelete.link ? (
                    <img 
                      src={empleadoToDelete.link} 
                      alt={empleadoToDelete.nombre}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-xs border-2 border-gray-500"
                    style={empleadoToDelete.link ? {display: 'none'} : {}}
                  >
                    👤
                  </div>
                  <div>
                    <div className="font-medium text-gray-100">{empleadoToDelete.nombre}</div>
                    <div className="text-sm text-gray-400">No. {empleadoToDelete.nde} • {empleadoToDelete.pos}</div>
                  </div>
                </div>
              </div>
              <p className="text-red-400 text-sm mt-3">⚠️ Esta acción no se puede deshacer</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={deleteEmpleado}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario modal */}
      {showForm && (
        <EmpleadoForm
          empleadoId={editingEmpleado}
          onClose={() => {
            setShowForm(false);
            setEditingEmpleado(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingEmpleado(null);
            fetchEmpleados();
          }}
        />
      )}
    </div>
  );
};

export default SkillMatrix;
