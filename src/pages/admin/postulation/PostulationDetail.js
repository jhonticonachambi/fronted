// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import PostulationsTable from '../postulation/PostulationsTable'; // Asegúrate de que la ruta sea correcta
// import API_URL from '../../../config/apiConfig'; // Asegúrate de que la ruta sea correcta

// const PostulationDetail = () => {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);
//   const [postulations, setPostulations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPostulations, setSelectedPostulations] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     const fetchProjectData = async () => {
//       try {
//         const projectResponse = await axios.get(`${API_URL}/projects/${id}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         });
//         setProject(projectResponse.data);

//         const postulationsResponse = await axios.get(`${API_URL}/postulations/project/${id}`);
//         setPostulations(postulationsResponse.data);
//       } catch (err) {
//         setError('Error al cargar los detalles del proyecto o las postulaciones');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectData();
//   }, [id]);

//   const handleCheckboxChange = (postulationId) => {
//     setSelectedPostulations((prevSelected) =>
//       prevSelected.includes(postulationId)
//         ? prevSelected.filter((id) => id !== postulationId)
//         : [...prevSelected, postulationId]
//     );
//   };

//   const updatePostulationsStatus = async () => {
//     try {
//       await axios.put(
//         // `${API_URL}/postulations/update-status`,
//         `${API_URL}/postulations/status`,
//         {
//           ids: selectedPostulations,
//           newStatus: 'accepted',
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       alert('Estado actualizado exitosamente');
//       setPostulations((prevPostulations) =>
//         prevPostulations.map((postulation) =>
//           selectedPostulations.includes(postulation._id)
//             ? { ...postulation, status: 'accepted' }
//             : postulation
//         )
//       );
//       setSelectedPostulations([]);
//     } catch (error) {
//       console.error('Error al actualizar el estado:', error);
//       alert('Hubo un error al actualizar el estado');
//     }
//   };

//   const fetchUserProfile = async (userId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/auth/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSelectedUser(response.data);
//       setShowModal(true);
//     } catch (error) {
//       console.error('Error al obtener el perfil:', error);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedUser(null);
//   };

//   if (loading) return <p>Cargando detalles del proyecto...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="p-6 bg-gray-100">
//       {/* Breadcrumbs */}
//       <nav className="mb-4">
//         <ol className="list-reset flex text-blue-600">
//           <li>
//             <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
//           </li>
//           <li>
//             <span className="mx-2">/</span>
//             <Link to="/gestion-de-postulacion" className="text-blue-500 hover:underline">Gestión de Postulacion</Link>
//           </li>
//           <li>
//             <span className="mx-2">/</span>
//             <span className="text-gray-600">{project ? project.name : 'Cargando...'}</span>
//           </li>
//         </ol>
//       </nav>

//       {project ? (
//         <>
//           <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
//           {project.image && (
//             <img src={project.image} alt={project.name} className="w-full h-64 object-cover rounded-lg mb-4" />
//           )}
//           <p className="mb-2"><strong>Descripción:</strong> {project.description}</p>
//           <p className="mb-2">
//             <strong>Fecha Límite:</strong> {new Date(project.endDate).toLocaleDateString('es-ES')}
//           </p>
//           <p className="mb-2"><strong>Detalles Adicionales:</strong> {project.details}</p>

//           {/* Tabla de usuarios postulados */}
//           <h2 className="text-xl font-semibold mt-8">Usuarios Postulados</h2>
//           {postulations.length > 0 ? (
//             <PostulationsTable 
//               postulations={postulations} 
//               selectedPostulations={selectedPostulations} 
//               handleCheckboxChange={handleCheckboxChange} 
//               fetchUserProfile={fetchUserProfile} 
//             />
//           ) : (
//             <p className="mt-4 text-gray-600">No hay postulaciones registradas para este proyecto.</p>
//           )}
//           <p className="mb-2"><strong>Número de Voluntarios Máximos:</strong> {project.volunteersRequired}</p>

//           <button
//             onClick={updatePostulationsStatus}
//             className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
//             disabled={selectedPostulations.length === 0}
//           >
//             Aceptar Seleccionados
//           </button>

//           <Link to="/gestion-de-postulacion" className="mt-4 inline-block bg-gray-500 text-white py-2 px-4 rounded">
//             Regresar
//           </Link>

//           {/* Modal para mostrar el perfil del usuario */}
//           {showModal && selectedUser && (
//             <div className="fixed inset-0 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
//                 <h2 className="text-xl font-bold mb-4">Perfil de {selectedUser.name}</h2>

//                 {/* Imagen del usuario */}
//                 {selectedUser.photo && (
//                   <img
//                     src={selectedUser.photo} // Asegúrate de que este campo contenga la URL de la imagen
//                     alt={selectedUser.name}
//                     className="w-full h-32 object-cover rounded-lg mb-4"
//                   />
//                 )}

//                 <p><strong>Email:</strong> {selectedUser.email}</p>
//                 <p><strong>Teléfono:</strong> {selectedUser.phone}</p>
//                 <p><strong>DNI:</strong> {selectedUser.dni}</p> {/* Nuevo campo */}
//                 <p><strong>Dirección:</strong> {selectedUser.address}</p> {/* Nuevo campo */}
//                 <p><strong>Rol:</strong> {selectedUser.role}</p> {/* Nuevo campo */}
//                 <p><strong>Habilidades:</strong> {selectedUser.skills.join(', ')}</p> {/* Nuevo campo */}
//                 <p><strong>Descripción:</strong> {selectedUser.description || 'No hay descripción disponible.'}</p> {/* Muestra un mensaje por defecto si no hay descripción */}

//                 <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Cerrar</button>
//               </div>
//               <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
//             </div>
//           )}
//         </>
//       ) : (
//         <p>Proyecto no encontrado.</p>
//       )}
//     </div>
//   );
// };

// export default PostulationDetail;


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
    setSelectedPostulations((prevSelected) =>
      prevSelected.includes(postulationId)
        ? prevSelected.filter((id) => id !== postulationId)
        : [...prevSelected, postulationId]
    );
  };

  const updatePostulationsStatus = async () => {
    try {
      await axios.put(
        `${API_URL}/postulations/status`,
        {
          ids: selectedPostulations,
          newStatus: 'accepted',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert('Estado actualizado exitosamente');
      setPostulations((prevPostulations) =>
        prevPostulations.map((postulation) =>
          selectedPostulations.includes(postulation._id)
            ? { ...postulation, status: 'accepted' }
            : postulation
        )
      );
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Usuarios Postulados</h2>
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
      )}

      {/* User Profile Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4">
                        Perfil de {selectedUser.name}
                      </h3>
                      <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-col md:flex-row gap-6">
                        {selectedUser.photo && (
                          <div className="flex-shrink-0">
                            <img
                              src={selectedUser.photo}
                              alt={selectedUser.name}
                              className="h-32 w-32 rounded-full object-cover border-4 border-blue-100"
                            />
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Teléfono</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedUser.phone || 'No especificado'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">DNI</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedUser.dni || 'No especificado'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Rol</p>
                            <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.role || 'No especificado'}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Dirección</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedUser.address || 'No especificada'}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Habilidades</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedUser.skills?.length > 0 ? (
                                selectedUser.skills.map((skill, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No hay habilidades registradas</p>
                              )}
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Descripción</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {selectedUser.description || 'No hay descripción disponible.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
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