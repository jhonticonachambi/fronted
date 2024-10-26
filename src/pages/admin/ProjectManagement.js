
import React, { useState, useEffect } from 'react';
import { FaTh, FaTable } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectManagement = () => {
  const [view, setView] = useState("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para obtener todos los proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://backend-rdf2.onrender.com/api/projects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProjects(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error al obtener los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects(); // Llamar a la función para obtener todos los proyectos
  }, []);

  // Filtrar proyectos según el término de búsqueda
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
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

       
        {/* Botón para crear nuevo proyecto con margen superior */}
        <Link to="/admin/create-project" className="bg-green-500 text-white py-2 px-4 rounded inline-block mb-4">
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
              <div key={project._id} className="bg-white shadow-md rounded flex flex-col" style={{ height: '350px', width: '100%' }}>
                <img 
                  src={project.bannerImage} 
                  alt={project.name} 
                  className="h-1/2 w-full object-cover rounded-t" 
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="flex-grow mb-4">{project.description}</p>
                  <p className="text-gray-600">Fecha Límite: {project.endDate}</p>
                  <Link to={`/project/${project._id}`} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded self-start">Ver Detalles</Link>
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
                  <th className="py-2 px-4">Fecha Límite</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="border-t">
                    <td className="py-2 px-4">{project.name}</td>
                    <td className="py-2 px-4">{project.description}</td>
                    <td className="py-2 px-4">{project.endDate}</td>
                    <td className="py-2 px-4">
                      <Link to={`/project/${project._id}`} className="text-blue-500">Ver Detalles</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
