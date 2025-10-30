import React, { useState, useEffect } from 'react';

export default function SessionTimer() {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutos en segundos
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    // Función para actualizar última actividad
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    // Eventos que consideramos actividad
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Actualizar el contador cada segundo
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivity) / 1000);
      const remaining = Math.max(0, 5 * 60 - elapsed);
      setTimeLeft(remaining);
    }, 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (5 * 60)) * 100;

  // Cambiar color según el tiempo restante
  const getColorClass = () => {
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBarColorClass = () => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="hidden md:flex items-center gap-2 bg-gray-800 bg-opacity-50 px-3 py-2 rounded-lg">
      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      <div className="flex flex-col">
        <span className={`text-xs font-mono font-semibold ${getColorClass()}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
          <div 
            className={`h-full ${getBarColorClass()} transition-all duration-1000`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
