// layouts/AdminLayout.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para alternar el estado del Sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // useEffect para cerrar el Sidebar en dispositivos grandes
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
    <div className="flex h-screen overflow-hidden">
      {/* Botón de menú para dispositivos móviles con margen inferior */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 text-gray-800 bg-gray-200 fixed z-20 top-4 left-4 mb-4" // Añadido mb-4 para el espacio inferior
      >
        <FaBars />
      </button>

      {/* Overlay para el sidebar en dispositivos móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar} // Cierra el sidebar al hacer clic fuera
        ></div>
      )}

      {/* Sidebar que se muestra u oculta dependiendo del estado */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-20 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-grow bg-gray-100 p-6 transition-all duration-200 md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
