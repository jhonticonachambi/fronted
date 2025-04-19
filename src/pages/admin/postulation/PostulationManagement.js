// //pages/admin/postulation/PostulationManagement.js
// import React, { useState, useEffect } from 'react';
// import { FaTh, FaTable } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import API_URL from '../../../config/apiConfig';

// const PostulationManagement = () => {
//   const [view, setView] = useState("cards");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/projects`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setProjects(response.data);
//       } catch (err) {
//         setError(err.response ? err.response.data.message : 'Error al obtener los proyectos');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const filteredProjects = projects.filter(project =>
//     project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     project.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'activo':
//         return 'bg-green-500'; // Verde para activo
//       case 'en progreso':
//         return 'bg-yellow-500'; // Amarillo para en progreso
//       case 'finalizado':
//         return 'bg-blue-500'; // Azul para finalizado
//       case 'cancelado':
//         return 'bg-red-500'; // Rojo para cancelado
//       default:
//         return 'bg-gray-500'; // Gris por defecto
//     }
//   };

//   if (loading) return <p>Cargando proyectos...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="flex-1 p-6 bg-gray-100">
//       {/* Breadcrumbs */}
//       <nav className="mb-4">
//         <ol className="flex space-x-2">
//           <li>
//             <Link to="/dashboard" className="text-blue-500 hover:underline">Inicio</Link>
//           </li>
//           <li>/</li>
//           <li>
//             <span className="text-gray-600">Gestión de Postulantes</span>
//           </li>
//         </ol>
//       </nav>

//       {/* Fila para búsqueda y selector de vista */}
//       <div className="flex items-center justify-between mb-4">
//         <input
//           type="text"
//           placeholder="Buscar proyectos..."
//           className="p-2 border border-gray-300 rounded w-full md:w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         {/* Selector de vista con íconos */}
//         <div className="flex space-x-4 ml-4">
//           <button
//             onClick={() => setView("cards")}
//             className={`p-2 rounded ${view === "cards" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
//           >
//             <FaTh size={20} />
//           </button>
//           <button
//             onClick={() => setView("datatable")}
//             className={`p-2 rounded ${view === "datatable" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
//           >
//             <FaTable size={20} />
//           </button>
//         </div>
//       </div>

//       {view === "cards" ? (
//         // Vista de Tarjetas
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {filteredProjects.map((project) => (
//             <div key={project._id} className="bg-white shadow-md rounded-lg flex flex-col" style={{ height: '400px', width: '100%' }}>
//               <img 
//                 src={project.bannerImage || 'https://via.placeholder.com/345x180?text=No+Image+Available'} 
//                 alt={project.name} 
//                 className="h-48 w-full object-cover rounded-t-lg" 
//               />
//               <div className="p-4 flex flex-col flex-grow">
//               <span className={`inline-block py-1 px-2 mb-3 text-sm font-semibold text-white rounded-full ${getStatusColor(project.status)}`}>
//                   {project.status}
//               </span>



//                 <h3 className="text-xl font-bold mb-2">{project.name}</h3>
//                 <p className="text-gray-600 mb-4">Fecha Límite: {new Date(project.endDate).toLocaleDateString()}</p>
                
//                 {/* Contenedor para los botones */}
//                 <div className="flex space-x-2 mt-auto">
//                   <Link to={`/postulacion/asignar-voluntarios/${project._id}`} className="bg-blue-500 text-white py-1 px-3 rounded text-center text-sm flex-1">
//                     Asignar Voluintarios
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </section>
//       ) : (
//         // Vista de Tabla
//         <section>
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="py-2 px-4">Proyecto</th>
//                 <th className="py-2 px-4">Descripción</th>
//                 <th className="py-2 px-4">Estado</th>
//                 <th className="py-2 px-4">Fecha Límite</th>
//                 <th className="py-2 px-4">Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProjects.map((project) => (
//                 <tr key={project._id} className="border-t">
//                   <td className="py-2 px-4">{project.name}</td>
//                   <td className="py-2 px-4">{project.description}</td>
//                   <td className="py-2 px-4">{project.status}</td>
//                   <td className="py-2 px-4">{new Date(project.endDate).toLocaleDateString()}</td>
//                   <td className="py-2 px-4">
//                     <Link to={`/postulacion/asignar-voluntarios/${project._id}`} className="text-blue-500">Asignar</Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>
//       )}
//     </div>
//   );
// };

// export default PostulationManagement;





// pages/admin/postulation/PostulationManagement.js
import React, { useState, useEffect } from 'react';
import { 
  FaUserPlus, 
  FaSearch, 
  FaUsers, 
  FaCalendarAlt,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaUserCheck
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../config/apiConfig';
import StatusPill from '../../../components/ui/StatusPill';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorAlert from '../../../components/alerts/ErrorAlert';

const PostulationManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProjects(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error al obtener los proyectos');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    // Filtro por término de búsqueda
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por estado
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && project.status === 'activo') ||
      (filter === 'completed' && project.status === 'finalizado');
    
    return matchesSearch && matchesFilter;
  });

  const getVolunteersCount = (project) => {
    return project.volunteersAssigned ? project.volunteersAssigned.length : 0;
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          <FaUserPlus className="inline mr-2 text-purple-600" />
          Asignación de Voluntarios
        </h1>
        <p className="text-gray-600">
          Gestiona y asigna voluntarios a los diferentes proyectos
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar proyectos..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Finalizados
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FaUsers className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {searchTerm ? 'No hay resultados' : 'No hay proyectos disponibles'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'No encontramos proyectos que coincidan con tu búsqueda'
                : filter === 'active' 
                  ? 'No hay proyectos activos en este momento'
                  : 'No hay proyectos para mostrar'}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div 
              key={project._id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {project.name}
                  </h3>
                  <StatusPill 
                    status={project.status} 
                    variant={
                      project.status === 'activo' ? 'success' :
                      project.status === 'finalizado' ? 'info' :
                      'neutral'
                    }
                  />
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-5">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-2 text-purple-500" />
                    <span>Finaliza: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2 text-purple-500" />
                    <span>
                      {getVolunteersCount(project)}/{project.volunteersRequired || '∞'} voluntarios
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/postulacion/asignar-voluntarios/${project._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <FaUserCheck />
                    <span>Asignar Voluntarios</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostulationManagement;