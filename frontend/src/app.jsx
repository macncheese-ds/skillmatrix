import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { api } from './api.js';
import Dashboard from './pages/Dashboard.jsx';
import SkillMatrix from './pages/SkillMatrixSimple.jsx';
import Empleados from './pages/Empleados.jsx';
import Reportes from './pages/Reportes.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      setLoading(false);
      return;
    }

    try {
      // Decodificar token para obtener info del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        nombre: payload.nombre,
        username: payload.username,
        rol: payload.rol
      });
    } catch (error) {
      console.error('Error al verificar token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-100 text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header/Navbar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y Título */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">Skill Matrix SMT</h1>
              </div>
            </div>

            {/* Info Usuario */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-white font-medium text-sm flex items-center justify-end gap-2">
                  {user.nombre}
                </div>
                <div className="text-blue-200 text-xs">
                  {user.username} • {
                    user.rol === 'admin' ? 'Administrador' : 
                    user.rol === 'operador' ? 'Operador' : 
                    'Invitado'
                  }
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Tabs de Navegación */}
          <div className="flex gap-2 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-gray-900 text-white border-t-2 border-blue-400'
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('matriz')}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'matriz'
                  ? 'bg-gray-900 text-white border-t-2 border-blue-400'
                  : 'text-blue-200 hover:bg-blue-700 hover:text-white'
              }`}
            >
              Matriz de Habilidades
            </button>
            
            {/* Solo para admin y operador */}
            {(user.rol === 'admin' || user.rol === 'operador') && (
              <button
                onClick={() => setActiveTab('empleados')}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'empleados'
                    ? 'bg-gray-900 text-white border-t-2 border-blue-400'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
              >
                Empleados
              </button>
            )}
            
            {/* Solo para admin */}
            {user.rol === 'admin' && (
              <button
                onClick={() => setActiveTab('reportes')}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'reportes'
                    ? 'bg-gray-900 text-white border-t-2 border-blue-400'
                    : 'text-blue-200 hover:bg-blue-700 hover:text-white'
                }`}
              >
                Reportes
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && <Dashboard user={user} />}
        {activeTab === 'matriz' && <SkillMatrix user={user} />}
        {activeTab === 'empleados' && (user.rol === 'admin' || user.rol === 'operador') && <Empleados user={user} />}
        {activeTab === 'reportes' && user.rol === 'admin' && <Reportes user={user} />}
      </main>
    </div>
  );
}
