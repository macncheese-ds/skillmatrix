import { useEffect, useRef } from 'react';

/**
 * Hook para manejar timeout de sesión
 * @param {Function} onTimeout - Callback cuando expira la sesión
 * @param {number} timeout - Tiempo en milisegundos (default: 5 minutos)
 */
export function useSessionTimeout(onTimeout, timeout = 5 * 60 * 1000) {
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Crear nuevo timeout
    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, timeout);
  };

  useEffect(() => {
    // Lista de eventos que consideramos como "actividad"
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Iniciar el timer
    resetTimer();

    // Agregar listeners para resetear el timer
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Limpiar al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeout, onTimeout]);

  return resetTimer;
}
