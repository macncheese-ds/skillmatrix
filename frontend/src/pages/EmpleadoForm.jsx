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

  const operaciones = [
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
  ];

  useEffect(() => {
    if (empleadoId) {
      fetchEmpleado();
    }
  }, [empleadoId]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h2 className="text-xl font-bold">
            {empleadoId ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Empleado Completo *
              </label>
              <input
                type="number"
                value={empleado.nde}
                onChange={(e) => handleChange('nde', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 12345"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                value={empleado.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Ingreso *
              </label>
              <input
                type="date"
                value={empleado.fi}
                onChange={(e) => handleChange('fi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto
              </label>
              <ImageUploader
                currentImage={empleado.link}
                onImageChange={(imageUrl) => handleChange('link', imageUrl)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posición *
              </label>
              <select
                value={empleado.pos}
                onChange={(e) => handleChange('pos', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar posición...</option>
                <option value="SMT TECHNICIAN">SMT TECHNICIAN</option>
                <option value="Operator">Operator</option>
                <option value="Materialist">Materialist</option>
                <option value="Production Technician">Production Technician</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Líneas de Trabajo *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {lineasDisponibles.map((linea) => (
                  <label key={linea} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLines.includes(linea)}
                      onChange={() => handleLineToggle(linea)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{linea}</span>
                  </label>
                ))}
              </div>
              {selectedLines.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Seleccionadas:</strong> {selectedLines.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Matriz de habilidades */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Certificaciones de Operaciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {operaciones.map((op) => (
                <div key={op.id} className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {op.nombre}
                  </label>
                  <select
                    value={empleado[op.id]}
                    onChange={(e) => handleChange(op.id, parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
