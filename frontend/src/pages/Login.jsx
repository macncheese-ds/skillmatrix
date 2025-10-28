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
    <div className="min-h-screen grid place-items-center bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-2xl p-4 sm:p-6 shadow-lg">
        <h1 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-100">
          Skill Matrix - Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
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
                  onClick={handleReset}
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
          {error && (
            <div className="text-red-400 text-xs sm:text-sm bg-red-900/30 border border-red-700 rounded px-3 py-2">
              {error}
            </div>
          )}

          {/* Botón de login (solo visible si hay usuario y contraseña) */}
          {userInfo && (
            <button
              type="submit"
              className="touch-target w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base transition-colors disabled:opacity-50 animate-fadeIn"
              disabled={loginLoading || !password}
            >
              {loginLoading ? 'Ingresando...' : 'Entrar'}
            </button>
          )}

          {/* Ayuda */}
          {!userInfo && (
            <p className="text-xs text-gray-400 text-center">
              Ingresa tu número de empleado y presiona Enter o clic fuera del campo
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
