import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      {/* Botón de menú para dispositivos móviles */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 text-gray-800 bg-gray-200 fixed z-20"
      >
        <FaBars />
      </button>

      {/* Sidebar que se muestra u oculta dependiendo del estado */}
      <div className={`fixed z-10 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-grow bg-gray-100 p-6 ml-0 transition-all md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
 