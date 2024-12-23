
// components/Sidebar.js
import React, { useState } from 'react';
import { FaClipboardList, FaHome, FaTasks, FaCog, FaBell, FaSignOutAlt, FaListAlt, FaChartBar, FaUser } from 'react-icons/fa';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="h-screen w-64 bg-gray-800 text-white shadow-lg">
      {/* Encabezado del Sidebar */}
      <div className="flex justify-center items-center h-20 bg-gray-800">
        <h1 className="text-2xl font-bold">Organizador</h1>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
            <FaHome className="h-6 w-6" />
            <a href="/dashboard" className="flex-grow">Home</a>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
            <FaListAlt className="h-6 w-6" />
            <a href="/gestion-de-proyectos" className="flex-grow">Gestión de Proyectos</a>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
            <FaTasks className="h-6 w-6" />
            <a href="/gestion-de-postulacion" className="flex-grow">Gestion de Postulantes</a>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
            <FaChartBar className="h-6 w-6" />
            <a href="/gestion-de-reportes" className="flex-grow">Gestion de Reportes</a>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
            <FaClipboardList className="h-6 w-6" />
            <a href="/gestion-de-tareas" className="flex-grow">Gestion de Tareas</a>
          </li>
        </ul>
      </nav>

      {/* Dropdown de usuario */}
      <div className="relative p-4">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
        >
          <span>Organizador</span>
          <FaCog className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <ul className="absolute bottom-20 left-4 right-4 bg-gray-700 text-white rounded-md shadow-lg z-10 md:w-full">
            <li className="flex items-center px-4 py-2 hover:bg-gray-600">
              <FaUser className="h-5 w-5 mr-2" />
              <a href="/perfil">Perfil</a>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-600">
              <FaBell className="h-5 w-5 mr-2" />
              <a href="/notifications">Notificaciones</a>
            </li>
            <li className="flex items-center px-4 py-2 hover:bg-gray-600">
              <FaSignOutAlt className="h-5 w-5 mr-2" />
              <a href="/login">Cerrar Sesión</a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
