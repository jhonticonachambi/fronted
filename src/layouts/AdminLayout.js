// layouts/AdminLayout.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 m-0 p-0"> {/* Eliminado overflow-hidden */}
      {/* Botón de menú para móviles */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 text-gray-800 bg-gray-200 fixed z-20 top-4 left-4 mb-4"
      >
        <FaBars />
      </button>

      {/* Overlay para el sidebar en móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-20 transform m-0 p-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Contenido principal - ÁREA MODIFICADA */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;