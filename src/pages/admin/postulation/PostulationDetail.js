// src/pages/admin/postulation/PostulationDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostulationsTable from '../postulation/PostulationsTable';
import API_URL from '../../../config/apiConfig';

const PostulationDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostulations, setSelectedPostulations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await axios.get(`${API_URL}/projects/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProject(projectResponse.data);

        const postulationsResponse = await axios.get(`${API_URL}/postulations/project/${id}`);
        setPostulations(postulationsResponse.data);
      } catch (err) {
        setError('Error al cargar los detalles del proyecto o las postulaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);
  const handleCheckboxChange = (postulationId) => {
    // Verificar si la postulación está en estado 'accepted'
    const postulation = postulations.find(p => p._id === postulationId);
    if (postulation && postulation.status.toLowerCase() === 'accepted') {
      return; // No permitir cambios en postulaciones ya aceptadas
    }
    
    setSelectedPostulations((prevSelected) =>
      prevSelected.includes(postulationId)
        ? prevSelected.filter((id) => id !== postulationId)
        : [...prevSelected, postulationId]
    );
  };
  const updatePostulationsStatus = async () => {
    try {
      // Filtrar para asegurarse de que no se envíen postulaciones ya aceptadas
      const pendingPostulations = selectedPostulations.filter(id => {
        const postulation = postulations.find(p => p._id === id);
        return postulation && postulation.status.toLowerCase() !== 'accepted';
      });
      
      if (pendingPostulations.length === 0) {
        alert('No hay postulaciones pendientes seleccionadas para aceptar');
        return;
      }
      
      await axios.put(
        `${API_URL}/postulations/status`,
        {
          ids: pendingPostulations,
          newStatus: 'accepted',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      alert('Estado actualizado exitosamente');
      
      // Actualizar el estado local de las postulaciones
      setPostulations((prevPostulations) =>
        prevPostulations.map((postulation) =>
          pendingPostulations.includes(postulation._id)
            ? { ...postulation, status: 'accepted' }
            : postulation
        )
      );
      
      // Limpiar selección
      setSelectedPostulations([]);
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('Hubo un error al actualizar el estado');
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6 bg-red-50 text-red-600 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
      <p>{error}</p>
      <Link to="/gestion-de-postulacion" className="mt-4 inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition">
        Regresar
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 transition">
              Dashboard
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link to="/gestion-de-postulacion" className="text-blue-500 hover:text-blue-700 transition">
              Gestión de Postulación
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-600 font-medium">
            {project ? project.name : 'Cargando...'}
          </li>
        </ol>
      </nav>

      {project ? (
        <div className="max-w-6xl mx-auto">
          {/* Project Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            {project.image && (
              <img 
                src={project.image} 
                alt={project.name} 
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-1">Descripción</h2>
                  <p className="text-gray-600">{project.description}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-1">Detalles Adicionales</h2>
                  <p className="text-gray-600">{project.details}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700">
                  <span className="font-medium">Fecha Límite:</span> {new Date(project.endDate).toLocaleDateString('es-ES')}
                </div>
                <div className="bg-green-50 px-3 py-1 rounded-full text-green-700">
                  <span className="font-medium">Voluntarios Requeridos:</span> {project.volunteersRequired}
                </div>
              </div>
            </div>
          </div>

          {/* Postulations Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Usuarios Postulados</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Las postulaciones ya aceptadas aparecen con fondo verde y no pueden ser seleccionadas nuevamente.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={updatePostulationsStatus}
                    className={`px-4 py-2 rounded-lg transition ${selectedPostulations.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    disabled={selectedPostulations.length === 0}
                  >
                    Aceptar Seleccionados
                  </button>
                  <Link 
                    to="/gestion-de-postulacion" 
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    Regresar
                  </Link>
                </div>
              </div>

              {postulations.length > 0 ? (
                <PostulationsTable 
                  postulations={postulations} 
                  selectedPostulations={selectedPostulations} 
                  handleCheckboxChange={handleCheckboxChange} 
                  fetchUserProfile={fetchUserProfile} 
                />
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No hay postulaciones</h3>
                  <p className="mt-1 text-gray-500">No se han encontrado postulaciones para este proyecto.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Proyecto no encontrado</h3>
          <p className="mt-1 text-gray-500">No se pudo cargar la información del proyecto solicitado.</p>
          <div className="mt-6">
            <Link to="/gestion-de-postulacion" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition inline-block">
              Regresar
            </Link>
          </div>
        </div>
      )}      {/* User Profile Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Header con nombre y botón de cerrar */}
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">
                  Perfil de Voluntario
                </h3>
                <button onClick={closeModal} className="text-white hover:text-gray-200 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Contenido principal */}
              <div className="bg-white px-6 pt-6 pb-4">
                {/* Información básica del perfil */}
                <div className="flex flex-col md:flex-row gap-8 pb-6 border-b border-gray-200">
                  {/* Foto e Información principal */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="mb-3 h-40 w-40 relative rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                      <img
                        src={selectedUser.photo || 'https://via.placeholder.com/150?text=Usuario'}
                        alt={selectedUser.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h4 className="text-xl font-medium text-center text-gray-900">{selectedUser.name}</h4>
                    <div className="mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium capitalize">
                      {selectedUser.role || 'Voluntario'}
                    </div>
                  </div>
                  
                  {/* Detalles personales */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mt-4 md:mt-0">
                    <div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900 ml-7">{selectedUser.email}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900 ml-7">{selectedUser.phone || 'No especificado'}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">DNI</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900 ml-7">{selectedUser.dni || 'No especificado'}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-500">Dirección</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-900 ml-7">{selectedUser.address || 'No especificada'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Sección de habilidades */}
                <div className="mt-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center mb-3">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h4 className="text-base font-medium text-gray-700">Habilidades</h4>
                  </div>
                  <div className="ml-7">
                    {selectedUser.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No hay habilidades registradas</p>
                    )}
                  </div>
                </div>
                
                {/* Sección de descripción */}
                <div className="mt-6">
                  <div className="flex items-center mb-3">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h4 className="text-base font-medium text-gray-700">Acerca del voluntario</h4>
                  </div>
                  <div className="ml-7 bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {selectedUser.description || 'Este voluntario no ha proporcionado una descripción.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer con botones */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostulationDetail;