
// // components/Sidebar.js
// import React, { useState } from 'react';
// import { FaClipboardList, FaHome, FaTasks, FaCog, FaBell, FaSignOutAlt, FaListAlt, FaChartBar, FaUser } from 'react-icons/fa';

// const Sidebar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//   return (
//     <div className="h-screen w-64 bg-gray-800 text-white shadow-lg">
//       {/* Encabezado del Sidebar */}
//       <div className="flex justify-center items-center h-20 bg-gray-800">
//         <h1 className="text-2xl font-bold">Organizador</h1>
//       </div>

//       {/* Menú de navegación */}
//       <nav className="flex-grow">
//         <ul className="space-y-2 p-4">
//           <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
//             <FaHome className="h-6 w-6" />
//             <a href="/dashboard" className="flex-grow">Home</a>
//           </li>
//           <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
//             <FaListAlt className="h-6 w-6" />
//             <a href="/gestion-de-proyectos" className="flex-grow">Gestión de Proyectos</a>
//           </li>
//           <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
//             <FaTasks className="h-6 w-6" />
//             <a href="/gestion-de-postulacion" className="flex-grow">Gestion de Postulantes</a>
//           </li>
//           <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
//             <FaChartBar className="h-6 w-6" />
//             <a href="/gestion-de-reportes" className="flex-grow">Gestion de Reportes</a>
//           </li>
//           <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md cursor-pointer">
//             <FaClipboardList className="h-6 w-6" />
//             <a href="/gestion-de-tareas" className="flex-grow">Gestion de Tareas</a>
//           </li>
//         </ul>
//       </nav>

//       {/* Dropdown de usuario */}
//       <div className="relative p-4">
//         <button
//           onClick={toggleDropdown}
//           className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
//         >
//           <span>Organizador</span>
//           <FaCog className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
//         </button>

//         {/* Dropdown */}
//         {isDropdownOpen && (
//           <ul className="absolute bottom-20 left-4 right-4 bg-gray-700 text-white rounded-md shadow-lg z-10 md:w-full">
//             <li className="flex items-center px-4 py-2 hover:bg-gray-600">
//               <FaUser className="h-5 w-5 mr-2" />
//               <a href="/perfil">Perfil</a>
//             </li>
//             <li className="flex items-center px-4 py-2 hover:bg-gray-600">
//               <FaBell className="h-5 w-5 mr-2" />
//               <a href="/notifications">Notificaciones</a>
//             </li>
//             <li className="flex items-center px-4 py-2 hover:bg-gray-600">
//               <FaSignOutAlt className="h-5 w-5 mr-2" />
//               <a href="/login">Cerrar Sesión</a>
//             </li>
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// components/Sidebar.js
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
  FaChevronUp
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const menuItems = [
    { path: '/dashboard', icon: <FaHome className="h-5 w-5" />, label: 'Inicio' },
    { path: '/gestion-de-proyectos', icon: <FaListAlt className="h-5 w-5" />, label: 'Proyectos' },
    { path: '/gestion-de-postulacion', icon: <FaTasks className="h-5 w-5" />, label: 'Postulantes' },
    { path: '/gestion-de-reportes', icon: <FaChartBar className="h-5 w-5" />, label: 'Reportes' },
    { path: '/gestion-de-tareas', icon: <FaClipboardList className="h-5 w-5" />, label: 'Tareas' }
  ];

  const userMenu = [
    { path: '/perfil', icon: <FaUser className="h-4 w-4" />, label: 'Perfil' },
    { path: '/notifications', icon: <FaBell className="h-4 w-4" />, label: 'Notificaciones' },
    { path: '/login', icon: <FaSignOutAlt className="h-4 w-4" />, label: 'Cerrar Sesión' }
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-xl flex flex-col">
      {/* Encabezado del Sidebar */}
      <div className="flex items-center justify-center h-20 px-4 border-b border-gray-700">
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
      <nav className="flex-grow px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
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
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Dropdown de usuario */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={toggleDropdown}
          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${
            isDropdownOpen ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <FaUser className="h-4 w-4 text-gray-300" />
            </div>
            <span className="font-medium">Mi Cuenta</span>
          </div>
          {isDropdownOpen ? (
            <FaChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <FaChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <ul className="mt-2 space-y-1 animate-fadeIn">
            {userMenu.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 ml-4"
                >
                  <span className="text-gray-400">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
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