// pages/admin/project/ProjectView.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import API_URL from '../../../config/apiConfig';
import VolunteerTrackingModal from '../../../components/modals/VolunteerTrackingModal';
import StatusBadge from '../../../components/ui/StatusBadge';
import { formatDate } from '../../../utils/dateUtils';
import { CircularProgress, Alert } from '@mui/material';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [postulations, setPostulations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_URL}/projects/info/${id}`);
        
        if (response.data) {
          setProject(response.data.project || null);
          setPostulations(response.data.postulations || []);
          setTasks(response.data.tasks || []);
        } else {
          throw new Error('Datos del proyecto no disponibles');
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err.response?.data?.message || err.message || 'Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }

    return () => {
      // Cleanup si es necesario
    };
  }, [id]);

  const handleViewTracking = (volunteerId) => {
    setSelectedVolunteer(volunteerId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No se encontró el proyecto solicitado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Modal de seguimiento */}
      {selectedVolunteer && (
        <VolunteerTrackingModal
          volunteerId={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
        />
      )}

      {/* Encabezado del proyecto */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="relative h-48 bg-gray-200">
          {project.bannerImage && (
            <img
              src={project.bannerImage}
              alt={`Banner de ${project.name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-project-banner.jpg';
              }}
            />
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-6">{project.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Detalles del Proyecto</h3>
              <div className="space-y-1">
                <div className="flex">
                  <span className="text-gray-500 w-32">Tipo:</span>
                  <span className="capitalize">{project.projectType}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Estado:</span>
                  <StatusBadge status={project.status} />
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Voluntarios:</span>
                  <span>{postulations.length} / {project.volunteersRequired || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Fechas</h3>
              <div className="space-y-1">
                <div className="flex">
                  <span className="text-gray-500 w-32">Inicio:</span>
                  <span>{formatDate(project.startDate)}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Fin:</span>
                  <span>{formatDate(project.endDate)}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32">Duración:</span>
                  <span>
                    {project.startDate && project.endDate ? (
                      `${Math.ceil(
                        (new Date(project.endDate) - new Date(project.startDate)) / 
                        (1000 * 60 * 60 * 24)
                      )} días`
                    ) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Postulantes y Tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de Postulantes */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Voluntarios Postulados</h2>
            <p className="text-sm text-gray-500">
              {postulations.length} de {project.volunteersRequired || '∞'} requeridos
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {postulations.length > 0 ? (
              postulations.map((postulation) => (
                <div 
                  key={postulation._id} 
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{postulation.userId?.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{postulation.userId?.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <StatusBadge status={postulation.status} />
                      
                      <button
                        onClick={() => handleViewTracking(postulation.userId?._id)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                      >
                        Ver seguimiento
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No hay voluntarios postulados a este proyecto
              </div>
            )}
          </div>
        </div>

        {/* Sección de Tareas */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Tareas del Proyecto</h2>
            <p className="text-sm text-gray-500">
              {tasks.filter(t => t.status === 'completed').length} de {tasks.length} completadas
            </p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div 
                  key={task._id} 
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-800 mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={task.status}>
                      Estado: {task.status}
                    </StatusBadge>
                    
                    <StatusBadge status={task.priority}>
                      Prioridad: {task.priority}
                    </StatusBadge>
                    
                    {task.dueDate && (
                      <StatusBadge status={
                        new Date(task.dueDate) < new Date() && task.status !== 'completed' 
                          ? 'overdue' 
                          : 'default'
                      }>
                        Vence: {formatDate(task.dueDate)}
                      </StatusBadge>
                    )}
                  </div>
                  
                  {task.assignedTo?.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Asignado a:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.assignedTo.map(user => (
                          <span 
                            key={user._id} 
                            className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                          >
                            {user.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No hay tareas asignadas a este proyecto
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;