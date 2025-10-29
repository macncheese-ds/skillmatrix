import { useState, useEffect } from 'react';
import { api } from '../api.js';
import EmpleadoForm from './EmpleadoForm.jsx';

const Empleados = ({ user }) => {
  const [empleados, setEmpleados] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [modalNivelFilter, setModalNivelFilter] = useState('all');

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
      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
      setProcesos(procesosData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setEmpleados([]);
      setProcesos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmpleados = fetchData;

  const showDeleteConfirmation = (empleado) => {
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

  const filteredEmpleados = (empleados || []).filter(empleado => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return String(empleado.nombre || '').toLowerCase().includes(query) ||
           String(empleado.nde || '').toLowerCase().includes(query) ||
           String(empleado.pos || '').toLowerCase().includes(query) ||
           String(empleado.line || '').toLowerCase().includes(query);
  });

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

  const PieChart = ({ value, size = 32 }) => {
    const radius = 14;
    const circumference = 2 * Math.PI * radius;
    const percentage = value / 4;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    
    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-100">{value}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-100">Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">
              {user.rol === 'admin' ? 'Gestión de Empleados' : 'Consulta de Empleados'}
            </h1>
            <p className="text-gray-400 mt-1">
              Total: {empleados.length} empleados registrados
              {user.rol === 'operador' && ' • Vista de operador'}
            </p>
          </div>
          {user.rol === 'admin' && (
            <button
              onClick={() => {
                setEditingEmpleado(null);
                setShowForm(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Empleado
            </button>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, número, posición o línea..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
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
      </div>

      {/* Lista de Empleados */}
      {filteredEmpleados.length === 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-lg p-12 border border-gray-700 text-center">
          <div className="text-gray-400 text-lg mb-4">
            {searchQuery ? `No se encontraron empleados para "${searchQuery}"` : 'No hay empleados registrados'}
          </div>
          {!searchQuery && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Agregar Primer Empleado
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmpleados.map((empleado) => (
            <div
              key={empleado.id}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all hover:border-blue-500 cursor-pointer"
              onDoubleClick={() => {
                setSelectedEmpleado(empleado);
                setShowDetailsModal(true);
              }}
              title="Doble click para ver detalles completos"
            >
              {/* Foto */}
              <div className="p-6 pb-4">
                <div className="flex justify-center mb-4">
                  {empleado.link ? (
                    <img
                      src={empleado.link}
                      alt={empleado.nombre}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 text-4xl border-4 border-gray-600"
                    style={empleado.link ? { display: 'none' } : {}}
                  >
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Información */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-gray-100" title={empleado.nombre}>
                    {empleado.nombre}
                  </h3>
                  <div className="text-sm text-gray-400">
                    No. {empleado.nde}
                  </div>
                  <div className="text-sm text-gray-300 bg-gray-700 rounded px-3 py-1 inline-block">
                    {empleado.pos}
                  </div>
                  {empleado.line && (
                    <div className="text-xs text-gray-400">
                      Línea: {empleado.line}
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción - Solo para admin */}
              {user.rol === 'admin' && (
                <div className="border-t border-gray-700 p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEmpleado(empleado.id);
                      setShowForm(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={() => showDeleteConfirmation(empleado)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              )}
              
              {/* Vista solo lectura para operador */}
              {user.rol === 'operador' && (
                <div className="border-t border-gray-700 p-4">
                  <div className="text-center text-gray-400 text-sm py-2">
                    👁️ Vista de solo lectura
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && empleadoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border-2 border-red-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-100">Confirmar Eliminación</h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-4">¿Estás seguro de que quieres eliminar a este empleado?</p>
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                <div className="font-medium text-gray-100 text-lg">{empleadoToDelete.nombre}</div>
                <div className="text-sm text-gray-400 mt-1">
                  No. {empleadoToDelete.nde} - {empleadoToDelete.pos}
                </div>
              </div>
              <p className="text-red-400 text-sm mt-4">⚠️ Esta acción no se puede deshacer</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setEmpleadoToDelete(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={deleteEmpleado}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
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

      {/* Modal de detalles completos del empleado */}
      {showDetailsModal && selectedEmpleado && (
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
                      {selectedEmpleado.line && (
                        <>
                          <span>•</span>
                          <span>Línea: {selectedEmpleado.line}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex gap-2">
                  {user.rol === 'admin' && (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        setEditingEmpleado(selectedEmpleado.id);
                        setShowForm(true);
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      title="Editar empleado"
                    >
                      Editar
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedEmpleado(null);
                      setModalSearchQuery('');
                      setModalNivelFilter('all');
                    }}
                    className="text-gray-400 hover:text-gray-200 text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                    title="Cerrar"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Estadísticas resumidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {procesos.filter(op => (selectedEmpleado[op.id] || 0) >= 4).length}
                  </div>
                  <div className="text-xs text-green-300 mt-1">Experto</div>
                </div>
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {procesos.filter(op => (selectedEmpleado[op.id] || 0) === 3).length}
                  </div>
                  <div className="text-xs text-blue-300 mt-1">Avanzado</div>
                </div>
                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {procesos.filter(op => (selectedEmpleado[op.id] || 0) === 2).length}
                  </div>
                  <div className="text-xs text-yellow-300 mt-1">Intermedio</div>
                </div>
                <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {procesos.filter(op => (selectedEmpleado[op.id] || 0) === 1).length}
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
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
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
              
              {procesos.filter(op => {
                if (!modalSearchQuery && modalNivelFilter === 'all') return true;
                const matchesSearch = !modalSearchQuery || 
                  op.nombre.toLowerCase().includes(modalSearchQuery.toLowerCase());
                const matchesNivel = modalNivelFilter === 'all' || 
                  (selectedEmpleado[op.id] || 0) === parseInt(modalNivelFilter);
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
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {procesos
                    .filter(op => {
                      if (!modalSearchQuery && modalNivelFilter === 'all') return true;
                      const matchesSearch = !modalSearchQuery || 
                        op.nombre.toLowerCase().includes(modalSearchQuery.toLowerCase());
                      const matchesNivel = modalNivelFilter === 'all' || 
                        (selectedEmpleado[op.id] || 0) === parseInt(modalNivelFilter);
                      return matchesSearch && matchesNivel;
                    })
                    .map((op) => {
                      const nivel = selectedEmpleado[op.id] || 0;
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
    </div>
  );
};

export default Empleados;
