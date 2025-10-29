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
  const [numEmpleado, setNumEmpleado] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [authError, setAuthError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalNivelFilter, setModalNivelFilter] = useState('all'); // 'all', '4', '3', '2', '1', '0'
  const [operaciones, setOperaciones] = useState([]);
  const [showNewProcesoModal, setShowNewProcesoModal] = useState(false);
  const [newProcesoNombre, setNewProcesoNombre] = useState('');
  const [creatingProceso, setCreatingProceso] = useState(false);

  // Cargar procesos dinámicamente desde la base de datos
  useEffect(() => {
    fetchProcesos();
  }, []);

  const fetchProcesos = async () => {
    try {
      const data = await api.get('/procesos');
      setOperaciones(data);
    } catch (error) {
      console.error('Error fetching procesos:', error);
      // Fallback a procesos hardcodeados si falla
      setOperaciones([
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
      ]);
    }
  };

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

  // Lookup de usuario por num_empleado
  const handleLookup = async () => {
    if (!numEmpleado.trim()) return;
    
    setLookupLoading(true);
    setAuthError('');
    setUserInfo(null);
    
    try {
      const data = await api.get(`/auth/lookup/${numEmpleado.trim().toUpperCase()}`);
      setUserInfo(data);
    } catch (e) {
      const message = e.response?.data?.message || 'Usuario no encontrado';
      setAuthError(message);
      setUserInfo(null);
    } finally {
      setLookupLoading(false);
    }
  };

  // Autenticación para modo edición
  const handleEditAuth = async (e) => {
    e.preventDefault();
    if (!userInfo || !password) return;

    setLoginLoading(true);
    setAuthError('');

    try {
      const data = await api.post('/auth/login', { 
        username: userInfo.num_empleado, 
        password 
      });
      
      if (data.token) {
        setAuthToken(data.token);
        setEditMode(true);
        setShowAuthModal(false);
        setNumEmpleado('');
        setPassword('');
        setUserInfo(null);
        setCurrentView('detalle');
      }
    } catch (error) {
      setAuthError('Contraseña incorrecta');
    } finally {
      setLoginLoading(false);
    }
  };

  // Función para salir del modo edición
  const exitEditMode = () => {
    setEditMode(false);
    setShowForm(false);
    setEditingEmpleado(null);
    setAuthToken(null);
  };

  // Reset del modal
  const resetAuthModal = () => {
    setShowAuthModal(false);
    setNumEmpleado('');
    setPassword('');
    setUserInfo(null);
    setAuthError('');
  };

  // Manejar Enter en el campo de número de empleado
  const handleNumEmpleadoKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLookup();
    }
  };

  // Crear nuevo proceso
  const handleCreateProceso = async (e) => {
    e.preventDefault();
    if (!newProcesoNombre.trim()) return;

    setCreatingProceso(true);
    try {
      await api.post('/procesos', { nombre: newProcesoNombre.trim() });
      await fetchProcesos(); // Recargar la lista de procesos
      await fetchEmpleados(); // Recargar empleados para que tengan la nueva columna
      setShowNewProcesoModal(false);
      setNewProcesoNombre('');
      alert('✅ Proceso creado exitosamente');
    } catch (error) {
      console.error('Error creating proceso:', error);
      const message = error.response?.data?.message || 'Error al crear el proceso';
      alert('❌ ' + message);
    } finally {
      setCreatingProceso(false);
    }
  };

  // Eliminar proceso
  const handleDeleteProceso = async (procesoId, procesoNombre) => {
    const confirmMessage = `⚠️ ¿Estás seguro de eliminar el proceso "${procesoNombre}"?\n\nEsto eliminará:\n- El proceso de la base de datos\n- La columna ${procesoId} de la tabla empleado\n- Todos los datos de certificación de este proceso\n\n⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER`;
    
    if (!confirm(confirmMessage)) return;

    try {
      await api.delete(`/procesos/${procesoId}`);
      await fetchProcesos(); // Recargar la lista de procesos
      await fetchEmpleados(); // Recargar empleados
      alert('✅ Proceso eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting proceso:', error);
      const message = error.response?.data?.message || 'Error al eliminar el proceso';
      alert('❌ ' + message);
    }
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
    <div className="p-2 sm:p-4 md:p-6 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div className="w-full sm:w-auto">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Matriz de Habilidades SMT</h1>
              <p className="text-blue-200 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                Gestión de competencias por empleado
                {editMode && <span className="ml-2 bg-green-600 px-2 py-1 rounded text-xs">MODO EDICIÓN</span>}
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-2 w-full sm:w-auto">
              {!editMode ? (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="touch-target bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors flex-1 sm:flex-none"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button 
                    onClick={exitEditMode}
                    className="touch-target bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1"
                  >
                    Salir
                  </button>
                  <button 
                    onClick={() => setShowNewProcesoModal(true)}
                    className="touch-target bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1"
                  >
                    + Proceso
                  </button>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="touch-target bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1"
                  >
                    + Empleado
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Navegación entre vistas */}
          <div className="flex gap-2 sm:gap-4 mt-3 sm:mt-4">
            <button 
              onClick={() => setCurrentView('resumen')}
              className={`touch-target flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                currentView === 'resumen' 
                  ? 'bg-white text-blue-800' 
                  : 'bg-blue-800 hover:bg-blue-700 active:bg-blue-600 text-white border border-blue-600'
              }`}
            >
              Resumen
            </button>
            <button 
              onClick={() => setCurrentView('detalle')}
              className={`touch-target flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                currentView === 'detalle' 
                  ? 'bg-white text-blue-800' 
                  : 'bg-blue-800 hover:bg-blue-700 active:bg-blue-600 text-white border border-blue-600'
              }`}
            >
              Empleados
            </button>
          </div>
        </div>

        {/* Contenido según la vista actual */}
        {currentView === 'resumen' ? (
          /* VISTA RESUMEN - Tabla compacta */
          <div className="p-3 sm:p-4 md:p-6 bg-gray-800">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-gray-100">Resumen de Procesos SMT</h2>
            
            {(!empleados || empleados.length === 0) ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-base sm:text-lg mb-4">
                  No hay empleados registrados en el sistema
                </div>
                {editMode && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="touch-target bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors"
                  >
                    + Agregar Primer Empleado
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-200 border-b border-gray-600">
                        Proceso
                      </th>
                      <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-200 border-b border-gray-600">
                        Certificados
                      </th>
                      <th className="hidden sm:table-cell text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-200 border-b border-gray-600">
                        Total
                      </th>
                      <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-200 border-b border-gray-600">
                        %
                      </th>
                      <th className="hidden md:table-cell text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-200 border-b border-gray-600 min-w-[200px]">
                        Cobertura
                      </th>
                      {editMode && (
                        <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-200 border-b border-gray-600">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getProcessSummary().map((proceso, idx) => {
                      const colors = proceso.totalCertificados <= 2 
                        ? 'bg-red-900/30 border-red-700/50' 
                        : proceso.totalCertificados <= 5 
                        ? 'bg-yellow-900/30 border-yellow-700/50' 
                        : 'bg-green-900/30 border-green-700/50';
                      
                      return (
                        <tr key={proceso.id} className={`${colors} ${idx % 2 === 0 ? 'bg-opacity-50' : ''} hover:bg-gray-650 transition-colors`}>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-700">
                            {proceso.nombre.replace(/\n/g, ' ')}
                          </td>
                          <td className="p-2 sm:p-3 text-center border-b border-gray-700">
                            <span className={`inline-block px-2 py-1 rounded text-xs sm:text-sm font-bold ${
                              proceso.totalCertificados <= 2 
                                ? 'bg-red-600 text-red-100' 
                                : proceso.totalCertificados <= 5 
                                ? 'bg-yellow-600 text-yellow-100' 
                                : 'bg-green-600 text-green-100'
                            }`}>
                              {proceso.totalCertificados}
                            </span>
                          </td>
                          <td className="hidden sm:table-cell p-2 sm:p-3 text-center text-xs sm:text-sm text-gray-300 border-b border-gray-700">
                            {proceso.totalEmpleados}
                          </td>
                          <td className="p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-gray-200 border-b border-gray-700">
                            {proceso.porcentaje}%
                          </td>
                          <td className="hidden md:table-cell p-2 sm:p-3 border-b border-gray-700">
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
                                {proceso.totalCertificados}/{proceso.totalEmpleados}
                              </span>
                            </div>
                          </td>
                          {editMode && (
                            <td className="p-2 sm:p-3 text-center border-b border-gray-700">
                              {/* Solo permitir eliminar procesos nuevos (op19 en adelante) */}
                              {parseInt(proceso.id.replace('op', '')) >= 19 ? (
                                <button
                                  onClick={() => handleDeleteProceso(proceso.id, proceso.nombre)}
                                  className="touch-target text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
                                  title="Eliminar proceso"
                                >
                                  🗑️
                                </button>
                              ) : (
                                <span className="text-xs text-gray-600" title="Los procesos originales no se pueden eliminar">
                                  -
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {/* Leyenda */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
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
            )}
          </div>
        ) : (
          /* VISTA DETALLE */
          <div className="bg-gray-800">
            {(!empleados || empleados.length === 0) ? (
              <div className="p-4 sm:p-6 md:p-8 text-center">
                <div className="text-gray-400 text-base sm:text-lg mb-4">
                  No hay empleados registrados en el sistema
                </div>
                {editMode && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="touch-target bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors"
                  >
                    + Agregar Primer Empleado
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Lista de empleados */}
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-100">Empleados y Certificaciones</h2>
                    
                    {/* Barra de búsqueda */}
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-2.5 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm sm:text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="touch-target absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                        >
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Mostrar resultados de búsqueda */}
                  {searchQuery && (
                    <div className="mb-3 sm:mb-4 text-gray-400 text-xs sm:text-sm">
                      {filteredEmpleados.length} empleado(s) encontrado(s) para "{searchQuery}"
                    </div>
                  )}
                  
                  <div className="space-y-3 sm:space-y-4">
                    {filteredEmpleados.length === 0 && searchQuery ? (
                      <div className="text-center py-8 sm:py-12">
                        <div className="text-gray-400 text-base sm:text-lg mb-4">
                          No se encontraron empleados que coincidan con "{searchQuery}"
                        </div>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="touch-target bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors"
                        >
                          Limpiar búsqueda
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                        {filteredEmpleados.map((empleado) => (
                          <div 
                            key={empleado.id}
                            className="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer hover:border-blue-500"
                            onClick={() => {
                              setSelectedEmpleado(empleado);
                              setShowSkillsModal(true);
                            }}
                          >
                            {/* Foto */}
                            <div className="flex justify-center mb-3">
                              {empleado.link ? (
                                <img 
                                  src={empleado.link} 
                                  alt={empleado.nombre}
                                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-500"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-3xl border-2 border-gray-500"
                                style={empleado.link ? {display: 'none'} : {}}
                              >
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Info */}
                            <div className="text-center space-y-1">
                              <div className="font-semibold text-sm text-gray-100 truncate" title={empleado.nombre}>
                                {empleado.nombre}
                              </div>
                              <div className="text-xs text-gray-400">
                                No. {empleado.nde}
                              </div>
                              <div className="text-xs text-gray-300 truncate" title={empleado.pos}>
                                {empleado.pos}
                              </div>
                              
                              {/* Badge de certificaciones */}
                              <div className="pt-2">
                                <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCounterColor(getCertificacionesAvanzadas(empleado))}`}>
                                  {getCertificacionesAvanzadas(empleado)} cert.
                                </div>
                              </div>
                            </div>
                            
                            {/* Botones de edición */}
                            {editMode && (
                              <div className="mt-3 pt-3 border-t border-gray-600 flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingEmpleado(empleado.id);
                                    setShowForm(true);
                                  }}
                                  className="touch-target flex-1 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white py-1.5 rounded text-xs font-medium"
                                  title="Editar"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showDeleteConfirmation(empleado);
                                  }}
                                  className="touch-target flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-1.5 rounded text-xs font-medium"
                                  title="Eliminar"
                                >
                                  Eliminar
                                </button>
                              </div>
                            )}
                            
                            {/* Indicador de clic */}
                            <div className="mt-2 text-xs text-gray-400 text-center">
                              Clic para detalles
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                

              </>
            )}
          </div>
        )}
      </div>

      {/* Modal de Skills Detallados */}
      {showSkillsModal && selectedEmpleado && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-blue-500 shadow-2xl my-8">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 sm:p-6 z-10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Foto */}
                  <div className="flex-shrink-0">
                    {selectedEmpleado.link ? (
                      <img 
                        src={selectedEmpleado.link} 
                        alt={selectedEmpleado.nombre}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 border-2 border-blue-500"
                      style={selectedEmpleado.link ? {display: 'none'} : {}}
                    >
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-400 truncate">
                      {selectedEmpleado.nombre}
                    </h2>
                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-300">
                      <span>No. {selectedEmpleado.nde}</span>
                      <span>•</span>
                      <span>{selectedEmpleado.pos}</span>
                      <span>•</span>
                      <span className="font-semibold text-blue-400">{getCertificacionesAvanzadas(selectedEmpleado)} Certificaciones</span>
                    </div>
                  </div>
                </div>
                
                {/* Botón cerrar */}
                <button 
                  onClick={() => {
                    setShowSkillsModal(false);
                    setSelectedEmpleado(null);
                    setModalSearchQuery('');
                    setModalNivelFilter('all'); // Limpiar filtro de nivel al cerrar
                  }}
                  className="touch-target flex-shrink-0 text-gray-400 hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                  title="Cerrar"
                >
                  ×
                </button>
              </div>
              
              {/* Estadísticas resumidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {operaciones.filter(op => selectedEmpleado[op.id] >= 4).length}
                  </div>
                  <div className="text-xs text-green-300 mt-1">Experto</div>
                </div>
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {operaciones.filter(op => selectedEmpleado[op.id] === 3).length}
                  </div>
                  <div className="text-xs text-blue-300 mt-1">Avanzado</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {operaciones.filter(op => selectedEmpleado[op.id] === 2).length}
                  </div>
                  <div className="text-xs text-yellow-300 mt-1">Intermedio</div>
                </div>
                <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {operaciones.filter(op => selectedEmpleado[op.id] === 1).length}
                  </div>
                  <div className="text-xs text-orange-300 mt-1">Básico</div>
                </div>
              </div>
            </div>
            
            {/* Contenido del Modal - Certificaciones */}
            <div className="p-4 sm:p-6 overflow-y-auto" style={{maxHeight: 'calc(90vh - 280px)'}}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-200">Certificaciones Detalladas</h3>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  {/* Filtro por nivel */}
                  <select
                    value={modalNivelFilter}
                    onChange={(e) => setModalNivelFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">Todos los niveles</option>
                    <option value="4">Experto (4)</option>
                    <option value="3">Avanzado (3)</option>
                    <option value="2">Intermedio (2)</option>
                    <option value="1">Básico (1)</option>
                    <option value="0">Sin certificación (0)</option>
                  </select>
                  
                  {/* Barra de búsqueda en modal */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <input
                      type="text"
                      placeholder="Buscar proceso..."
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {modalSearchQuery && (
                      <button
                        onClick={() => setModalSearchQuery('')}
                        className="touch-target absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Mostrar filtros activos */}
              {(modalSearchQuery || modalNivelFilter !== 'all') && (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className="text-gray-400">Filtros activos:</span>
                  {modalSearchQuery && (
                    <span className="bg-blue-900/30 border border-blue-700 text-blue-300 px-2 py-1 rounded-full">
                      Búsqueda: "{modalSearchQuery}"
                    </span>
                  )}
                  {modalNivelFilter !== 'all' && (
                    <span className={`px-2 py-1 rounded-full ${
                      modalNivelFilter === '4' ? 'bg-green-900/30 border border-green-700 text-green-300' :
                      modalNivelFilter === '3' ? 'bg-blue-900/30 border border-blue-700 text-blue-300' :
                      modalNivelFilter === '2' ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-300' :
                      modalNivelFilter === '1' ? 'bg-orange-900/30 border border-orange-700 text-orange-300' :
                      'bg-gray-700 border border-gray-600 text-gray-300'
                    }`}>
                      Nivel {modalNivelFilter === '0' ? 'Sin certificación' : modalNivelFilter}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setModalSearchQuery('');
                      setModalNivelFilter('all');
                    }}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
              
              {operaciones.filter(op => {
                if (!modalSearchQuery && modalNivelFilter === 'all') return true;
                
                // Filtro por búsqueda de texto
                const matchesSearch = !modalSearchQuery || 
                  op.nombre.toLowerCase().includes(modalSearchQuery.toLowerCase());
                
                // Filtro por nivel
                const matchesNivel = modalNivelFilter === 'all' || 
                  selectedEmpleado[op.id] === parseInt(modalNivelFilter);
                
                return matchesSearch && matchesNivel;
              }).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-base mb-4">
                    No se encontraron procesos con los filtros seleccionados
                  </div>
                  <button 
                    onClick={() => {
                      setModalSearchQuery('');
                      setModalNivelFilter('all');
                    }}
                    className="touch-target bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {operaciones
                    .filter(op => {
                      if (!modalSearchQuery && modalNivelFilter === 'all') return true;
                      
                      // Filtro por búsqueda de texto
                      const matchesSearch = !modalSearchQuery || 
                        op.nombre.toLowerCase().includes(modalSearchQuery.toLowerCase());
                      
                      // Filtro por nivel
                      const matchesNivel = modalNivelFilter === 'all' || 
                        selectedEmpleado[op.id] === parseInt(modalNivelFilter);
                      
                      return matchesSearch && matchesNivel;
                    })
                    .map((op) => {
                  const nivel = selectedEmpleado[op.id];
                  return (
                    <div 
                      key={op.id} 
                      className={`rounded-lg p-4 border-2 transition-all ${
                        nivel >= 4 ? 'bg-green-900/20 border-green-600 hover:bg-green-900/30' :
                        nivel >= 3 ? 'bg-blue-900/20 border-blue-600 hover:bg-blue-900/30' :
                        nivel >= 2 ? 'bg-yellow-900/20 border-yellow-600 hover:bg-yellow-900/30' :
                        nivel >= 1 ? 'bg-orange-900/20 border-orange-600 hover:bg-orange-900/30' :
                        'bg-gray-800 border-gray-600 hover:bg-gray-750'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-100 leading-tight mb-1">
                            {op.nombre.split('\n')[0]}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {op.nombre.split('\n')[1]}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <PieChart value={nivel} size={48} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          nivel >= 4 ? 'bg-green-600 text-green-100' :
                          nivel >= 3 ? 'bg-blue-600 text-blue-100' :
                          nivel >= 2 ? 'bg-yellow-600 text-yellow-100' :
                          nivel >= 1 ? 'bg-orange-600 text-orange-100' :
                          'bg-gray-600 text-gray-300'
                        }`}>
                          {getNivelTexto(nivel)}
                        </span>
                        <span className="text-lg font-bold text-gray-200">
                          {nivel}/4
                        </span>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de autenticación para modo edición */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-100">Acceso a Modo Edición</h2>
            <form onSubmit={handleEditAuth} className="space-y-4">
              {/* Número de Empleado */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número de Empleado
                </label>
                <input
                  type="text"
                  value={numEmpleado}
                  onChange={(e) => setNumEmpleado(e.target.value.toUpperCase())}
                  onBlur={handleLookup}
                  onKeyPress={handleNumEmpleadoKeyPress}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono uppercase"
                  placeholder="Ej: 1234A"
                  disabled={!!userInfo || lookupLoading}
                  autoFocus
                  required
                />
                {lookupLoading && (
                  <p className="mt-2 text-xs text-blue-400">
                    Buscando usuario...
                  </p>
                )}
              </div>

              {/* Info del usuario detectado */}
              {userInfo && (
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 animate-fadeIn">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-1">Usuario detectado</div>
                      <div className="font-semibold text-gray-100 text-lg">{userInfo.nombre}</div>
                      <div className="text-xs text-gray-400 mt-1">No. {userInfo.num_empleado}</div>
                      <div className="text-xs text-blue-400 mt-1">Rol: {userInfo.rol}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNumEmpleado('');
                        setUserInfo(null);
                        setPassword('');
                      }}
                      className="text-gray-400 hover:text-gray-200 text-sm underline"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              )}

              {/* Input de contraseña (solo visible si hay usuario) */}
              {userInfo && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Ingresa tu contraseña"
                    disabled={loginLoading}
                    autoFocus
                    required
                  />
                </div>
              )}

              {/* Mensajes de error */}
              {authError && (
                <div className="text-red-400 text-xs sm:text-sm bg-red-900/30 border border-red-700 rounded px-3 py-2">
                  {authError}
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetAuthModal}
                  className="touch-target flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white py-2 rounded-lg text-sm sm:text-base transition-colors"
                >
                  Cancelar
                </button>
                {userInfo && (
                  <button
                    type="submit"
                    className="touch-target flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 rounded-lg text-sm sm:text-base transition-colors disabled:opacity-50"
                    disabled={loginLoading || !password}
                  >
                    {loginLoading ? 'Ingresando...' : 'Entrar'}
                  </button>
                )}
              </div>

              {/* Ayuda */}
              {!userInfo && (
                <p className="text-xs text-gray-400 text-center">
                  Ingresa tu número de empleado y presiona Enter
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && empleadoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-900 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-100">Confirmar Eliminación</h2>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-300 mb-2 text-sm sm:text-base">¿Estás seguro de que quieres eliminar al empleado?</p>
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  {empleadoToDelete.link ? (
                    <img 
                      src={empleadoToDelete.link} 
                      alt={empleadoToDelete.nombre}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-500 flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-xs border-2 border-gray-500 flex-shrink-0"
                    style={empleadoToDelete.link ? {display: 'none'} : {}}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-100 text-sm sm:text-base truncate">{empleadoToDelete.nombre}</div>
                    <div className="text-xs sm:text-sm text-gray-400">No. {empleadoToDelete.nde} - {empleadoToDelete.pos}</div>
                  </div>
                </div>
              </div>
              <p className="text-red-400 text-xs sm:text-sm mt-3">ADVERTENCIA: Esta acción no se puede deshacer</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="touch-target flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white py-2 rounded-lg text-sm sm:text-base transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={deleteEmpleado}
                className="touch-target flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2 rounded-lg text-sm sm:text-base transition-colors"
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

      {/* Modal para crear nuevo proceso */}
      {showNewProcesoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-100">Agregar Nuevo Proceso</h2>
            <form onSubmit={handleCreateProceso} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Proceso
                </label>
                <textarea
                  value={newProcesoNombre}
                  onChange={(e) => setNewProcesoNombre(e.target.value)}
                  className="w-full border border-gray-600 rounded-lg px-3 py-2 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Ej: Process 210&#10;Nombre descriptivo del proceso"
                  rows="3"
                  required
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-400">
                  Usa saltos de línea para separar el número del proceso y su descripción
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                <p className="text-xs text-blue-300">
                  <strong>Nota:</strong> El nuevo proceso se agregará automáticamente para todos los empleados con nivel 0 (sin certificación).
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProcesoModal(false);
                    setNewProcesoNombre('');
                  }}
                  className="touch-target flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white py-2 rounded-lg text-sm sm:text-base transition-colors"
                  disabled={creatingProceso}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="touch-target flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-2 rounded-lg text-sm sm:text-base transition-colors disabled:opacity-50"
                  disabled={creatingProceso || !newProcesoNombre.trim()}
                >
                  {creatingProceso ? 'Creando...' : 'Crear Proceso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillMatrix;
