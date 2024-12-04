// import React, { useState, useEffect } from 'react';
// import { FaTh, FaTable } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import API_URL from '../../../config/apiConfig';

// const ProjectManagement = () => {
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
//             <span className="text-gray-600">Gestión de Proyectos</span>
//           </li>
//         </ol>
//       </nav>

//       {/* Botón para crear nuevo proyecto */}
//       <Link to="/crear-proyecto" className="bg-green-500 text-white py-2 px-4 rounded inline-block mb-4">
//         Crear Nuevo Proyecto
//       </Link>

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
//             <div key={project._id} className="bg-white shadow-md rounded-lg flex flex-col" style={{ height: '350px', width: '100%' }}>
//               <img 
//                 src={project.bannerImage || 'https://via.placeholder.com/345x180?text=No+Image+Available'} 
//                 alt={project.name} 
//                 className="h-48 w-full object-cover rounded-t-lg" 
//               />
//               <div className="p-4 flex flex-col flex-grow">
//                 <h3 className="text-xl font-bold mb-2">{project.name}</h3>
//                 <p className="flex-grow text-gray-600 mb-2">{project.status}</p>
//                 <p className="text-gray-600 mb-4">Fecha Límite: {new Date(project.endDate).toLocaleDateString()}</p>
//                 <Link to={`/proyecto/${project._id}`} className="mt-auto bg-blue-500 text-white py-2 px-4 rounded text-center">
//                   Ver Detalles
//                 </Link>
//                 <Link to={`/proyecto/editar/${project._id}`} className="mt-auto bg-blue-500 text-white py-2 px-4 rounded text-center">
//                   Editar
//                 </Link>
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
//                 <th className="py-2 px-4">Fecha Límite</th>
//                 <th className="py-2 px-4">Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProjects.map((project) => (
//                 <tr key={project._id} className="border-t">
//                   <td className="py-2 px-4">{project.name}</td>
//                   <td className="py-2 px-4">{project.description}</td>
//                   <td className="py-2 px-4">{new Date(project.endDate).toLocaleDateString()}</td>
//                   <td className="py-2 px-4">
//                     <Link to={`/proyecto/${project._id}`} className="text-blue-500">Ver Detalles</Link>
//                     <Link to={`/proyecto/editar/${project._id}`} className="text-blue-500">Editar</Link>
                    
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

// export default ProjectManagement;



import React, { useState, useEffect } from 'react';
import { FaTh, FaTable } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../config/apiConfig';

const ProjectManagement = () => {
  const [view, setView] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'activo':
        return 'bg-green-500'; // Verde para activo
      case 'en progreso':
        return 'bg-yellow-500'; // Amarillo para en progreso
      case 'finalizado':
        return 'bg-blue-500'; // Azul para finalizado
      case 'cancelado':
        return 'bg-red-500'; // Rojo para cancelado
      default:
        return 'bg-gray-500'; // Gris por defecto
    }
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex-1 p-6 bg-gray-100">
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="flex space-x-2">
          <li>
            <Link to="/dashboard" className="text-blue-500 hover:underline">Inicio</Link>
          </li>
          <li>/</li>
          <li>
            <span className="text-gray-600">Gestión de Proyectos</span>
          </li>
        </ol>
      </nav>

      {/* Botón para crear nuevo proyecto */}
      <Link to="/crear-proyecto" className="bg-green-500 text-white py-2 px-4 rounded inline-block mb-4">
        Crear Nuevo Proyecto
      </Link>

      {/* Fila para búsqueda y selector de vista */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar proyectos..."
          className="p-2 border border-gray-300 rounded w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Selector de vista con íconos */}
        <div className="flex space-x-4 ml-4">
          <button
            onClick={() => setView("cards")}
            className={`p-2 rounded ${view === "cards" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
          >
            <FaTh size={20} />
          </button>
          <button
            onClick={() => setView("datatable")}
            className={`p-2 rounded ${view === "datatable" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
          >
            <FaTable size={20} />
          </button>
        </div>
      </div>

      {view === "cards" ? (
        // Vista de Tarjetas
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project._id} className="bg-white shadow-md rounded-lg flex flex-col" style={{ height: '400px', width: '100%' }}>
              <img 
                src={project.bannerImage || 'https://via.placeholder.com/345x180?text=No+Image+Available'} 
                alt={project.name} 
                className="h-48 w-full object-cover rounded-t-lg" 
              />
              <div className="p-4 flex flex-col flex-grow">
              <span className={`inline-block py-1 px-2 mb-3 text-sm font-semibold text-white rounded-full ${getStatusColor(project.status)}`}>
                  {project.status}
              </span>



                <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">Fecha Límite: {new Date(project.endDate).toLocaleDateString()}</p>
                
                {/* Contenedor para los botones */}
                <div className="flex space-x-2 mt-auto">
                  
                  <Link to={`/proyecto/editar/${project._id}`} className="bg-blue-500 text-white py-1 px-3 rounded text-center text-sm flex-1">
                    Editar
                  </Link>
                  <Link to={`/proyecto/ver/${project._id}`} className="bg-blue-500 text-white py-1 px-3 rounded text-center text-sm flex-1">
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        // Vista de Tabla
        <section>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Proyecto</th>
                <th className="py-2 px-4">Descripción</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4">Fecha Límite</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id} className="border-t">
                  <td className="py-2 px-4">{project.name}</td>
                  <td className="py-2 px-4">{project.description}</td>
                  <td className="py-2 px-4">{project.status}</td>
                  <td className="py-2 px-4">{new Date(project.endDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <Link to={`/proyecto/ver/${project._id}`} className="text-blue-500">Ver Detalles</Link> | 

                    | <Link to={`/proyecto/editar/${project._id}`} className="text-blue-500">Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default ProjectManagement;
