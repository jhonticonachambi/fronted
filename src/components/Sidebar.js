import React, { useState } from 'react';
import { 
  FaHome, 
  FaListAlt, 
  FaTasks, 
  FaChartBar, 
  FaClipboardList, 
  FaUser, 
  FaBell, 
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp,
  FaBrain,
  FaRobot,
  FaChartLine,
  FaServer,
  FaCalendarAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMlDropdownOpen, setIsMlDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMlDropdown = () => setIsMlDropdownOpen(!isMlDropdownOpen);

  const menuItems = [
    { path: '/dashboard', icon: <FaHome className="h-5 w-5" />, label: 'Inicio' },
    { path: '/gestion-de-proyectos', icon: <FaListAlt className="h-5 w-5" />, label: 'Proyectos' },
    { path: '/gestion-de-postulacion', icon: <FaTasks className="h-5 w-5" />, label: 'Postulantes' },
    { path: '/gestion-de-eventos', icon: <FaCalendarAlt className="h-5 w-5" />, label: 'Eventos' },
    { path: '/gestion-de-reportes', icon: <FaChartBar className="h-5 w-5" />, label: 'Reportes' },
    { path: '/gestion-de-tareas', icon: <FaClipboardList className="h-5 w-5" />, label: 'Tareas' }
  ];

  const mlMenuItems = [
    { path: '/admin/recommendations', icon: <FaBrain className="h-4 w-4" />, label: 'Recomendaciones ML' },
    { path: '/admin/volunteer-metrics', icon: <FaChartLine className="h-4 w-4" />, label: 'Métricas de Voluntarios' },
    { path: '/admin/ml-status', icon: <FaServer className="h-4 w-4" />, label: 'Estado del Servicio ML' }
  ];

  const userMenu = [
    { path: '/perfil', icon: <FaUser className="h-4 w-4" />, label: 'Perfil' },
    { path: '/notifications', icon: <FaBell className="h-4 w-4" />, label: 'Notificaciones' },
    { path: '/login', icon: <FaSignOutAlt className="h-4 w-4" />, label: 'Cerrar Sesión' }
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl flex flex-col m-0 p-0 left-0 relative">
      {/* Encabezado del Sidebar */}
      <div className="flex items-center justify-center h-20 px-3 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
            Organizador
          </h1>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-grow px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  activeMenu === item.path 
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setActiveMenu(item.path)}
              >
                <span className={`${
                  activeMenu === item.path ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
          
          {/* Sección de Machine Learning */}
          <li className="mt-4">
            <button
              onClick={toggleMlDropdown}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isMlDropdownOpen ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaRobot className={`h-5 w-5 ${
                  isMlDropdownOpen ? 'text-white' : 'text-gray-400'
                }`} />
                <span className="font-medium text-sm">Recomendaciones</span>
              </div>
              {isMlDropdownOpen ? (
                <FaChevronUp className="h-3 w-3 text-gray-400" />
              ) : (
                <FaChevronDown className="h-3 w-3 text-gray-400" />
              )}
            </button>

            {/* Submenu de ML */}
            {isMlDropdownOpen && (
              <ul className="mt-1 space-y-1 animate-fadeIn">
                {mlMenuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ml-2 ${
                        activeMenu === item.path 
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveMenu(item.path)}
                    >
                      <span className={`${
                        activeMenu === item.path ? 'text-white' : 'text-gray-400'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="text-xs">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Dropdown de usuario */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={toggleDropdown}
          className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
            isDropdownOpen ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <FaUser className="h-4 w-4 text-gray-300" />
            </div>
            <span className="font-medium text-sm">Mi Cuenta</span>
          </div>
          {isDropdownOpen ? (
            <FaChevronUp className="h-3 w-3 text-gray-400" />
          ) : (
            <FaChevronDown className="h-3 w-3 text-gray-400" />
          )}
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <ul className="mt-1 space-y-1 animate-fadeIn">
            {userMenu.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 ml-2"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;