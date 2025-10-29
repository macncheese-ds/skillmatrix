import { useState, useEffect } from 'react';
import { api } from '../api.js';
import ImageUploader from '../components/ImageUploader.jsx';

const EmpleadoForm = ({ empleadoId, onClose, onSave }) => {
  const [empleado, setEmpleado] = useState({
    nde: '',
    link: '',
    fi: '',
    gaveta: 0,
    nombre: '',
    pos: '',
    line: '',
    op: 0, op1: 0, op2: 0, op3: 0, op4: 0, op5: 0, op6: 0, op7: 0, op8: 0, op9: 0,
    op10: 0, op11: 0, op12: 0, op13: 0, op14: 0, op15: 0, op16: 0, op17: 0, op18: 0
  });
  const [selectedLines, setSelectedLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lineasDisponibles = [
    'Magazine',
    'Modula',
    'MTT',
    'Linea 1',
    'Linea 2', 
    'Linea 3',
    'Linea 4',
    'Offline SMT'
  ];

  const [operaciones, setOperaciones] = useState([
    { id: 'op', nombre: 'Process 10/110 - Bottom/Top PCB Loading' },
    { id: 'op1', nombre: 'Process 20/120 - Bottom/Top Laser Marking' },
    { id: 'op2', nombre: 'Process 30/130 - Bottom/Top Solder Paste Printing' },
    { id: 'op3', nombre: 'Process 40/140 - Bottom/Top Solder Paste Inspection (SPI)' },
    { id: 'op4', nombre: 'Process 50/150 - Bottom/Top SMD Placement' },
    { id: 'op5', nombre: 'Process 55/155 - Bottom/Top Auto Optical Inspection (Pre AOI)' },
    { id: 'op6', nombre: 'Process 60/160 - Bottom/Top Reflow Soldering' },
    { id: 'op7', nombre: 'Process 70/170 - Bottom/Top Auto Optical Inspection (Post AOI)' },
    { id: 'op8', nombre: 'Process 80/180 - Bottom/Top Sideviewer' },
    { id: 'op9', nombre: 'Process 185 - Bottom Inspection' },
    { id: 'op10', nombre: 'Process 90/190 - Bottom/Top Unloading' },
    { id: 'op11', nombre: 'Process 195 - Bottom & Top Side 3D X-ray Inspection' },
    { id: 'op12', nombre: 'Process 200 - Etiquetado' },
    { id: 'op13', nombre: 'Process - Viscosimetro' },
    { id: 'op14', nombre: 'Process - Batidora de Pasta' },
    { id: 'op15', nombre: 'Process - Soldadura' },
    { id: 'op16', nombre: 'Process - Lavadora de Stenciles' },
    { id: 'op17', nombre: 'Process - Lavadora de Squeegees' },
    { id: 'op18', nombre: 'Process - MSL' }
  ]);

  useEffect(() => {
    fetchProcesos();
    if (empleadoId) {
      fetchEmpleado();
    }
  }, [empleadoId]);

  const fetchProcesos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/procesos');
      if (response.data && response.data.length > 0) {
        setOperaciones(response.data);
      }
    } catch (error) {
      console.warn('No se pudieron cargar procesos desde API, usando valores por defecto');
      // Ya tiene el fallback en el estado inicial
    }
  };

  useEffect(() => {
    // Actualizar el campo line cuando cambian las líneas seleccionadas
    setEmpleado(prev => ({
      ...prev,
      line: selectedLines.join(', ')
    }));
  }, [selectedLines]);

  const fetchEmpleado = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/empleados/${empleadoId}`);
      
      // Convertir fecha al formato YYYY-MM-DD si existe
      if (data.fi) {
        const date = new Date(data.fi);
        data.fi = date.toISOString().split('T')[0];
      }
      
      setEmpleado(data);
      // Cargar las líneas seleccionadas
      if (data.line) {
        setSelectedLines(data.line.split(', ').filter(line => line.trim()));
      }
    } catch (err) {
      setError('Error al cargar empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleLineToggle = (linea) => {
    setSelectedLines(prev => {
      if (prev.includes(linea)) {
        return prev.filter(l => l !== linea);
      } else {
        return [...prev, linea];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que al menos una línea esté seleccionada
    if (selectedLines.length === 0) {
      setError('Debe seleccionar al menos una línea de trabajo');
      return;
    }
    
    try {
      setLoading(true);
      if (empleadoId) {
        await api.put(`/empleados/${empleadoId}`, empleado);
      } else {
        await api.post('/empleados', empleado);
      }
      onSave();
    } catch (err) {
      setError('Error al guardar empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setEmpleado(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSkillLevel = (value) => {
    if (value >= 4) return 'Experto';
    if (value >= 3) return 'Avanzado';
    if (value >= 2) return 'Intermedio';
    if (value >= 1) return 'Básico';
    return 'Sin certificación';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-4 max-h-[95vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold">
            {empleadoId ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 mx-3 sm:mx-6 mt-3 sm:mt-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6">
          {/* Datos básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Número de Empleado Completo *
              </label>
              <input
                type="number"
                value={empleado.nde}
                onChange={(e) => handleChange('nde', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 12345"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={empleado.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Fecha de Ingreso *
              </label>
              <input
                type="date"
                value={empleado.fi}
                onChange={(e) => handleChange('fi', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Foto
              </label>
              <ImageUploader
                currentImage={empleado.link}
                onImageChange={(imageUrl) => handleChange('link', imageUrl)}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Posición *
              </label>
              <select
                value={empleado.pos}
                onChange={(e) => handleChange('pos', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar posición...</option>
                <option value="SMT TECHNICIAN">SMT TECHNICIAN</option>
                <option value="Operator">Operator</option>
                <option value="Materialist">Materialist</option>
                <option value="Production Technician">Production Technician</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Líneas de Trabajo *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {lineasDisponibles.map((linea) => (
                  <label key={linea} className="flex items-center space-x-2 cursor-pointer touch-target">
                    <input
                      type="checkbox"
                      checked={selectedLines.includes(linea)}
                      onChange={() => handleLineToggle(linea)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">{linea}</span>
                  </label>
                ))}
              </div>
              {selectedLines.length > 0 && (
                <div className="mt-2 text-xs sm:text-sm text-gray-600">
                  <strong>Seleccionadas:</strong> {selectedLines.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Matriz de habilidades */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Certificaciones de Operaciones</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {operaciones.map((op) => (
                <div key={op.id} className="border border-gray-200 rounded-lg p-3">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 leading-tight">
                    {op.nombre}
                  </label>
                  <select
                    value={empleado[op.id]}
                    onChange={(e) => handleChange(op.id, parseInt(e.target.value))}
                    className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>0 - Sin certificación</option>
                    <option value={1}>1 - Básico</option>
                    <option value={2}>2 - Intermedio</option>
                    <option value={3}>3 - Avanzado</option>
                    <option value={4}>4 - Experto</option>
                  </select>
                  <div className="mt-2 text-xs text-gray-500">
                    Estado: {getSkillLevel(empleado[op.id])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4 sticky bottom-0 bg-white pt-3 pb-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="touch-target w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="touch-target w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoForm;
