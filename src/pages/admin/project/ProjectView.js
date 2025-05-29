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
  const [activeTab, setActiveTab] = useState('volunteers');
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/projects/info/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Modal de seguimiento */}
      {selectedVolunteer && (
        <VolunteerTrackingModal
          volunteerId={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
        />
      )}      {/* Encabezado del proyecto */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
        <div className="relative h-32 sm:h-40 md:h-48 bg-gray-200">
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
        
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{project.description}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Detalles del Proyecto</h3>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row">
                  <span className="text-gray-500 text-xs sm:text-sm sm:w-32 font-medium">Tipo:</span>
                  <span className="capitalize text-sm sm:text-base">{project.projectType}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-gray-500 text-xs sm:text-sm sm:w-32 font-medium">Estado:</span>
                  <div className="mt-1 sm:mt-0">
                    <StatusBadge status={project.status} />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-gray-500 text-xs sm:text-sm sm:w-32 font-medium">Voluntarios:</span>
                  <span className="text-sm sm:text-base">{postulations.length} / {project.volunteersRequired || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Fechas</h3>
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row">
                  <span className="text-gray-500 text-xs sm:text-sm sm:w-32 font-medium">Inicio:</span>
                  <span className="text-sm sm:text-base">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-gray-500 text-xs sm:text-sm sm:w-32 font-medium">Fin:</span>
                  <span className="text-sm sm:text-base">{formatDate(project.endDate)}</span>
                </div>
                <div className="flex flex-col sm:flex-row">
                  <span className="text-gray-500 text-xs sm:text-sm sm:w-32 font-medium">Duración:</span>
                  <span className="text-sm sm:text-base">
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
      </div>{/* Postulantes y Tareas en Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">        {/* Tab Headers */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex min-w-max">
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'volunteers'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Voluntarios ({postulations.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tareas ({tasks.length})
            </button>
          </nav>
        </div>        {/* Tab Content */}
        <div className="p-3 sm:p-6">{activeTab === 'volunteers' && (
            <div>              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Voluntarios Postulados</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {postulations.length} de {project.volunteersRequired || '∞'} requeridos
                </p>
              </div>
              
              <div className="grid gap-4">
                {postulations.length > 0 ? (
                  postulations.map((postulation) => (                    <div 
                      key={postulation._id} 
                      className="bg-gradient-to-r from-white to-blue-50 border-l-4 border-blue-500 rounded-lg p-3 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md">
                              {postulation.userId?.name?.charAt(0)?.toUpperCase() || 'V'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          
                          {/* Información del voluntario */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-lg truncate">{postulation.userId?.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 flex items-center truncate">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                              <span className="truncate">{postulation.userId?.email}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Estado y acciones */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <div className="text-left sm:text-right">
                            <StatusBadge status={postulation.status} />
                            <p className="text-xs text-gray-500 mt-1">Estado</p>
                          </div>
                          
                          <button
                            onClick={() => handleViewTracking(postulation.userId?._id)}
                            className="flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-xs sm:text-sm shadow-md hover:shadow-lg w-full sm:w-auto"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="hidden sm:inline">Ver Seguimiento</span>
                            <span className="sm:hidden">Seguimiento</span>
                          </button>
                        </div>
                      </div>
                        {/* Información adicional si existe */}
                      {postulation.appliedAt && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Postulado el {formatDate(postulation.appliedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">No hay voluntarios postulados</h3>
                    <p className="text-sm text-gray-500">Este proyecto aún no tiene voluntarios interesados</p>
                  </div>
                )}
              </div>
            </div>
          )}          {activeTab === 'tasks' && (
            <div>              <div className="mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Tareas del Proyecto</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {tasks.filter(t => t.status === 'completed').length} de {tasks.length} completadas
                    </p>
                    {tasks.length > 0 && (
                      <div className="flex-1 max-w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {tasks.length > 0 ? (
                  tasks.map((task) => {
                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
                    const isCompleted = task.status === 'completed';
                    const isPending = task.status === 'pending';
                    const isInProgress = task.status === 'in_progress';
                    
                    return (
                      <div 
                        key={task._id} 
                        className={`relative bg-gradient-to-r rounded-xl p-4 sm:p-5 hover:shadow-lg transition-all duration-300 border-l-4 ${
                          isCompleted 
                            ? 'from-green-50 to-emerald-50 border-green-500 hover:shadow-green-100' 
                            : isOverdue 
                            ? 'from-red-50 to-pink-50 border-red-500 hover:shadow-red-100'
                            : isInProgress
                            ? 'from-yellow-50 to-amber-50 border-yellow-500 hover:shadow-yellow-100'
                            : 'from-blue-50 to-indigo-50 border-blue-500 hover:shadow-blue-100'
                        }`}
                      >
                        {/* Header de la tarea */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            {/* Checkbox de completado */}
                            <div className="mt-1">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300 hover:border-blue-400'
                              }`}>
                                {isCompleted && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-sm sm:text-base mb-1 ${
                                isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                              }`}>
                                {task.title}
                              </h3>
                              <p className={`text-xs sm:text-sm mb-3 ${
                                isCompleted ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {task.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Menú de acciones */}
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Badges de estado */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            isCompleted 
                              ? 'bg-green-100 text-green-800' 
                              : isOverdue 
                              ? 'bg-red-100 text-red-800'
                              : isInProgress
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-1.5 ${
                              isCompleted 
                                ? 'bg-green-500' 
                                : isOverdue 
                                ? 'bg-red-500'
                                : isInProgress
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                            }`}></div>
                            {task.status === 'completed' ? 'Completada' : 
                             task.status === 'in_progress' ? 'En Progreso' : 
                             task.status === 'pending' ? 'Pendiente' : task.status}
                          </span>
                          
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            task.priority === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {task.priority === 'high' ? '🔴 Alta' : 
                             task.priority === 'medium' ? '🟡 Media' : 
                             '🟢 Baja'} Prioridad
                          </span>
                          
                          {task.dueDate && (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              isOverdue 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {isOverdue ? 'Vencida' : 'Vence'}: {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                        
                        {/* Personas asignadas */}
                        {task.assignedTo?.length > 0 && (
                          <div className="border-t border-gray-200 border-opacity-50 pt-3">
                            <p className="text-xs font-medium text-gray-700 mb-2">Asignado a:</p>
                            <div className="flex flex-wrap gap-2">
                              {task.assignedTo.map(user => (
                                <div key={user._id} className="flex items-center space-x-2 bg-white bg-opacity-70 px-3 py-1.5 rounded-full">
                                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                  <span className="text-xs font-medium text-gray-800">
                                    {user.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">No hay tareas asignadas</h3>
                    <p className="text-sm text-gray-500">Este proyecto aún no tiene tareas asignadas</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;