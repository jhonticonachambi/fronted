// pages/admin/project/ProjectManagement.js
import React, { useState, useEffect } from 'react';
import { FaTh, FaTable, FaPlus, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../config/apiConfig';
import ProjectCard from '../../../components/cards/ProjectCard';
import DataTable from '../../../components/tables/ProjectTable';
import Breadcrumb from '../../../components/navigation/Breadcrumb';
import StatusBadge from '../../../components/ui/StatusBadge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import ErrorAlert from '../../../components/alerts/ErrorAlert';

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

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50">
      {/* Header Section */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: 'Inicio', path: '/dashboard' },
            { label: 'Gestión de Proyectos', active: true }
          ]}
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Proyectos</h1>
          
          <Link 
            to="/crear-proyecto" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
          >
            <FaPlus />
            <span>Nuevo Proyecto</span>
          </Link>
        </div>
      </div>

      {/* Search and View Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar proyectos por nombre o descripción..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("cards")}
            className={`p-2 rounded-md flex items-center gap-2 ${view === "cards" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
            aria-label="Vista de tarjetas"
          >
            <FaTh />
            <span className="hidden sm:inline">Tarjetas</span>
          </button>
          <button
            onClick={() => setView("datatable")}
            className={`p-2 rounded-md flex items-center gap-2 ${view === "datatable" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:bg-gray-200"}`}
            aria-label="Vista de tabla"
          >
            <FaTable />
            <span className="hidden sm:inline">Tabla</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No se encontraron proyectos</h3>
            <p className="text-gray-500 mb-4">No hay proyectos que coincidan con tu búsqueda</p>
            <Link 
              to="/crear-proyecto" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <FaPlus />
              <span>Crear nuevo proyecto</span>
            </Link>
          </div>
        ) : view === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <DataTable projects={filteredProjects} />
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;