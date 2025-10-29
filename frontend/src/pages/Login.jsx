// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { api, setAuthToken } from '../api.js';

export default function Login() {
  const [numEmpleado, setNumEmpleado] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Lookup automático al perder foco o presionar Enter
  const handleLookup = async () => {
    if (!numEmpleado.trim()) return;
    
    setLookupLoading(true);
    setError('');
    setUserInfo(null);
    
    try {
      const data = await api.get(`/auth/lookup/${numEmpleado.trim().toUpperCase()}`);
      setUserInfo(data);
    } catch (e) {
      const message = e.response?.data?.message || 'Usuario no encontrado';
      setError(message);
      setUserInfo(null);
    } finally {
      setLookupLoading(false);
    }
  };

  // Login con contraseña
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userInfo || !password) return;

    setLoginLoading(true);
    setError('');

    try {
      const data = await api.post('/auth/login', { 
        username: userInfo.num_empleado, 
        password 
      });
      
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      window.location.href = '/';
    } catch (e) {
      const message = e.response?.data?.message || 'Contraseña incorrecta';
      setError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Reset
  const handleReset = () => {
    setNumEmpleado('');
    setPassword('');
    setUserInfo(null);
    setError('');
  };

  // Manejar Enter en el campo de número de empleado
  const handleNumEmpleadoKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLookup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-2xl shadow-2xl mb-4">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Skill Matrix SMT</h1>
          <p className="text-blue-200">Sistema de Gestión de Habilidades</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gray-800 bg-opacity-90 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
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
                className="w-full border-2 border-gray-600 rounded-xl px-4 py-3 text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none font-mono uppercase transition-colors"
                placeholder="Ej: 1234A"
                disabled={!!userInfo || lookupLoading}
                autoFocus
                required
              />
              {lookupLoading && (
                <div className="mt-2 flex items-center text-sm text-blue-400">
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando usuario...
                </div>
              )}
            </div>

            {/* Info del usuario detectado */}
            {userInfo && (
              <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-xl p-4 border-2 border-green-600/50 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-400 font-medium">Usuario encontrado</span>
                    </div>
                    <div className="font-bold text-white text-xl">{userInfo.nombre}</div>
                    <div className="text-sm text-gray-300 mt-1">No. {userInfo.num_empleado}</div>
                    <div className="text-xs text-blue-400 mt-1 font-medium">
                      {userInfo.rol === 'admin' ? 'Administrador' : 'Operador'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-gray-400 hover:text-white text-sm underline transition-colors"
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
                  className="w-full border-2 border-gray-600 rounded-xl px-4 py-3 text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  disabled={loginLoading}
                  autoFocus
                  required
                />
              </div>
            )}

            {/* Mensajes de error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/30 border-2 border-red-700 rounded-xl px-4 py-3 animate-fadeIn">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Botón de login (solo visible si hay usuario y contraseña) */}
            {userInfo && (
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white rounded-xl px-4 py-4 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] animate-fadeIn"
                disabled={loginLoading || !password}
              >
                {loginLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Entrar al Sistema
                  </span>
                )}
              </button>
            )}

            {/* Ayuda */}
            {!userInfo && (
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Ingresa tu número de empleado y presiona <kbd className="px-2 py-1 bg-gray-700 rounded">Enter</kbd>
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Sistema de Gestión de Habilidades SMT</p>
          <p className="mt-1">2025 - Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}
