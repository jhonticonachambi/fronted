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