import React from 'react';

const RoleInfo = ({ user }) => {
  const getRoleInfo = () => {
    switch(user.rol) {
      case 'admin':
        return {
          title: 'Acceso de Administrador',
          color: 'bg-yellow-900/20 border-yellow-600',
          textColor: 'text-yellow-300',
          permissions: [
            { text: 'Ver todas las secciones', allowed: true },
            { text: 'Crear, editar y eliminar empleados', allowed: true },
            { text: 'Gestionar procesos dinámicos', allowed: true },
            { text: 'Acceso a reportes avanzados', allowed: true },
            { text: 'Exportar datos', allowed: true }
          ]
        };
      case 'operador':
        return {
          title: 'Acceso de Operador',
          color: 'bg-blue-900/20 border-blue-600',
          textColor: 'text-blue-300',
          permissions: [
            { text: 'Ver dashboard y estadísticas', allowed: true },
            { text: 'Consultar matriz de habilidades', allowed: true },
            { text: 'Ver listado de empleados', allowed: true },
            { text: 'No puede editar ni eliminar', allowed: false },
            { text: 'Sin acceso a reportes avanzados', allowed: false }
          ]
        };
      default:
        return {
          title: 'Acceso de Invitado',
          color: 'bg-gray-700/20 border-gray-500',
          textColor: 'text-gray-300',
          permissions: [
            { text: 'Ver dashboard básico', allowed: true },
            { text: 'Consultar matriz de habilidades', allowed: true },
            { text: 'Sin acceso a gestión de empleados', allowed: false },
            { text: 'Sin acceso a reportes', allowed: false },
            { text: 'Solo modo lectura', allowed: false }
          ]
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className={`rounded-lg border-2 ${roleInfo.color} p-6 mb-6`}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${roleInfo.textColor}`}>
            {roleInfo.title}
          </h3>
          <ul className="space-y-2">
            {roleInfo.permissions.map((permission, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <span className="flex-shrink-0">{permission.allowed ? '[✓]' : '[✗]'}</span>
                <span>{permission.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoleInfo;
