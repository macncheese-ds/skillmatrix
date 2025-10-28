// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { api, setAuthToken } from '../api.js';

export default function Login() {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('operador');
  const [registro, setRegistro] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setOk('');
    if (registro) {
      // Registro de usuario con validación de admin
      try {
        await api.post('/users/register', { 
          username, 
          password, 
          nombre, 
          rol, 
          adminUsername: adminUser, 
          adminPassword: adminPass 
        });
        setOk('Usuario registrado. Ahora puedes iniciar sesión.');
        setRegistro(false);
        setU(''); setP(''); setNombre(''); setAdminPass(''); setAdminUser(''); setRol('operador');
      } catch (e) {
        const message = e.response?.data?.message || 'Error registrando usuario.';
        setError(message);
      }
    } else {
      // Login
      try {
        const data = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', data.token);
        setAuthToken(data.token);
        window.location.href = '/';
      } catch {
        setError('Usuario o contraseña incorrectos');
      }
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-900 text-gray-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-2xl p-4 sm:p-6 shadow-lg">
        <h1 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-100">
          {registro ? 'Registrar usuario' : 'Iniciar sesión'}
        </h1>
        <div className="space-y-2.5 sm:space-y-3">
          <input
            className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Usuario"
            value={username}
            onChange={e => setU(e.target.value)}
          />
          <input
            type="password"
            className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Contraseña"
            value={password}
            onChange={e => setP(e.target.value)}
          />
          {registro && (
            <>
              <input
                className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Nombre completo"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
              <select
                className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 focus:border-blue-500 focus:outline-none"
                value={rol}
                onChange={e => setRol(e.target.value)}
              >
                <option value="operador">Operador</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>
              <input
                className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Usuario admin para validar registro"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
              />
              <input
                type="password"
                className="w-full border border-gray-600 rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                placeholder="Contraseña de admin para registrar"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
              />
            </>
          )}
          {error && <div className="text-red-400 text-xs sm:text-sm">{error}</div>}
          {ok && <div className="text-green-400 text-xs sm:text-sm">{ok}</div>}
          <button className="touch-target w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg px-3 py-2 sm:py-2.5 text-sm sm:text-base transition-colors">
            {registro ? 'Registrar' : 'Entrar'}
          </button>
          <button
            type="button"
            className="w-full text-xs sm:text-sm text-blue-400 underline mt-2 hover:text-blue-300 py-2"
            onClick={() => { setRegistro(r => !r); setError(''); setOk(''); }}
          >
            {registro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </form>
    </div>
  );
}
