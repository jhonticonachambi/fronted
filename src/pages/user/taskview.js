import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/apiConfig';
import { FiArrowLeft, FiCheckCircle, FiClock, FiAlertCircle, FiCalendar, FiUsers, FiEdit2, FiPlus } from 'react-icons/fi';

const TaskView = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks');
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, notStarted: 0 });
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || "Usuario";
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        setLoading(true);
        const [projectResponse, tasksResponse] = await Promise.all([
          axios.get(`${API_URL}/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${API_URL}/tasks/${userId}/${projectId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        ]);

        setProject(projectResponse.data);
        setTasks(tasksResponse.data);
          // Calcular estadísticas
        const completed = tasksResponse.data.filter(t => t.status === 'completed').length;
        const inProgress = tasksResponse.data.filter(t => t.status === 'in_progress').length;
        const notStarted = tasksResponse.data.filter(t => t.status === 'pending').length;
        
        setStats({ completed, inProgress, notStarted });
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar los detalles del proyecto o las tareas asignadas');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId, userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTaskClick = (taskId) => {
    navigate(`/proyecto/${projectId}/tarea/${taskId}`);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/tasks/${taskId}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));      // Actualizar estadísticas
      const updatedTasks = tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      
      const completed = updatedTasks.filter(t => t.status === 'completed').length;
      const inProgress = updatedTasks.filter(t => t.status === 'in_progress').length;
      const notStarted = updatedTasks.filter(t => t.status === 'pending').length;
      setStats({ completed, inProgress, notStarted });
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-6 bg-red-50 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link 
          to="/lista-proyectos" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Volver a proyectos
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-8">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Gestión de Tareas
              </h1>
              <p className="text-gray-600 text-lg">Administra y actualiza el estado de tus tareas asignadas</p>
            </div>
            <div className="flex-shrink-0 mt-2">
              <Link 
                to="/lista-proyectos" 
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                <FiArrowLeft className="mr-2" />
                Volver a proyectos
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {project ? (
          <>
            {/* Project Overview */}
            <section className="mb-12">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {project.bannerImage && (
                  <div className="h-48 md:h-64 w-full overflow-hidden">
                    <img
                      src={project.bannerImage}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{project.name}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <FiCalendar className="mr-1" />
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </span>
                        <span className="flex items-center">
                          <FiUsers className="mr-1" />
                          {project.volunteersRequired} voluntarios requeridos
                        </span>
                      </div>
                    </div>
                    {userRole === 'admin' && (
                      <Link 
                        to={`/proyecto/${projectId}/editar`}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mb-4 md:mb-0"
                      >
                        <FiEdit2 className="mr-2" />
                        Editar proyecto
                      </Link>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mt-4">{project.description}</p>
                </div>
              </div>
            </section>

            {/* Stats and Tabs */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-500">Tareas Completadas</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.completed}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${tasks.length ? (stats.completed / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-500">En Progreso</h3>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.inProgress}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-yellow-500 h-2.5 rounded-full" 
                      style={{ width: `${tasks.length ? (stats.inProgress / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pink-500">
                  <h3 className="text-sm font-medium text-gray-500">No Iniciadas</h3>
                  <p className="text-3xl font-bold text-pink-600 mt-2">{stats.notStarted}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-pink-500 h-2.5 rounded-full" 
                      style={{ width: `${tasks.length ? (stats.notStarted / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Mis Tareas
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Detalles del Proyecto
                  </button>
                </nav>
              </div>
            </section>

            {/* Content based on active tab */}
            {activeTab === 'tasks' ? (
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Tareas Asignadas</h2>
                  {userRole === 'admin' && (
                    <Link 
                      to={`/proyecto/${projectId}/crear-tarea`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="mr-2" />
                      Nueva Tarea
                    </Link>
                  )}
                </div>

                {tasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                      <div 
                        key={task._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">                          <div className="flex justify-between items-start mb-3">
                            <h3 
                              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                              onClick={() => handleTaskClick(task._id)}
                            >
                              {task.title || task.name}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.status === 'completed' ? 'bg-green-100 text-green-800' :
                              task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-pink-100 text-pink-800'
                            }`}>
                              {task.status === 'completed' ? 'Completada' : 
                               task.status === 'in_progress' ? 'En Progreso' : 'No Iniciada'}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                          
                          {task.dueDate && (
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <FiCalendar className="mr-1.5" />
                              <span>Fecha límite: {formatDate(task.dueDate)}</span>
                            </div>
                          )}                          <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusChange(task._id, 'pending')}
                                className={`p-1.5 rounded-md ${task.status === 'pending' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-500 hover:bg-pink-50'}`}
                                title="No iniciada"
                              >
                                <FiClock />
                              </button>
                              <button
                                onClick={() => handleStatusChange(task._id, 'in_progress')}
                                className={`p-1.5 rounded-md ${task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500 hover:bg-blue-50'}`}
                                title="En progreso"
                              >
                                <FiAlertCircle />
                              </button>
                              <button
                                onClick={() => handleStatusChange(task._id, 'completed')}
                                className={`p-1.5 rounded-md ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500 hover:bg-green-50'}`}
                                title="Completada"
                              >
                                <FiCheckCircle />
                              </button>
                            </div>
                            
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <FiAlertCircle className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas asignadas</h3>
                    <p className="text-gray-500 mb-4">Actualmente no tienes tareas asignadas para este proyecto.</p>
                    {userRole === 'admin' && (
                      <Link 
                        to={`/proyecto/${projectId}/crear-tarea`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FiPlus className="mr-2" />
                        Crear primera tarea
                      </Link>
                    )}
                  </div>
                )}
              </section>
            ) : (
              <section className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles del Proyecto</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Nombre del Proyecto</h4>
                        <p className="mt-1 text-gray-900">{project.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                        <p className="mt-1 text-gray-900">{project.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Fechas y Participantes</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Fecha de Inicio</h4>
                        <p className="mt-1 text-gray-900">{formatDate(project.startDate)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Fecha de Finalización</h4>
                        <p className="mt-1 text-gray-900">{formatDate(project.endDate)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Voluntarios Requeridos</h4>
                        <p className="mt-1 text-gray-900">{project.volunteersRequired}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Proyecto no encontrado</h3>
            <p className="text-gray-500 mb-4">El proyecto que estás buscando no existe o no tienes acceso.</p>
            <Link 
              to="/lista-proyectos" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Volver a proyectos
            </Link>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Plataforma de Voluntariado. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default TaskView;