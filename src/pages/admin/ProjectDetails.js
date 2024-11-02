import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostulationsTable from './PostulationsTable'; // Asegúrate de que la ruta sea correcta
import API_URL from '../../config/apiConfig'; // Asegúrate de que la ruta sea correcta

const ProjectDetails = () => {
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

        const postulationsResponse = await axios.get(`${API_URL}/postulaciones/proyecto/${id}`);
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
        `${API_URL}/postulaciones/actualizar-estado`,
        {
          ids: selectedPostulations,
          nuevoEstado: 'aceptado',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert('Estado actualizado exitosamente');
      setPostulations((prevPostulations) =>
        prevPostulations.map((postulation) =>
          selectedPostulations.includes(postulation._id)
            ? { ...postulation, status: 'aceptado' }
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

  if (loading) return <p>Cargando detalles del proyecto...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100">
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="list-reset flex text-blue-600">
          <li>
            <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
            <Link to="/project-management" className="text-blue-500 hover:underline">Project Management</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{project ? project.name : 'Cargando...'}</span>
          </li>
        </ol>
      </nav>

      {project ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
          {project.image && (
            <img src={project.image} alt={project.name} className="w-full h-64 object-cover rounded-lg mb-4" />
          )}
          <p className="mb-2"><strong>Descripción:</strong> {project.description}</p>
          <p className="mb-2"><strong>Fecha Límite:</strong> {project.endDate}</p>
          <p className="mb-2"><strong>Detalles Adicionales:</strong> {project.details}</p>

          {/* Tabla de usuarios postulados */}
          <h2 className="text-xl font-semibold mt-8">Usuarios Postulados</h2>
          {postulations.length > 0 ? (
            <PostulationsTable 
              postulations={postulations} 
              selectedPostulations={selectedPostulations} 
              handleCheckboxChange={handleCheckboxChange} 
              fetchUserProfile={fetchUserProfile} 
            />
          ) : (
            <p className="mt-4 text-gray-600">No hay postulaciones registradas para este proyecto.</p>
          )}
          <p className="mb-2"><strong>Número de Voluntarios Máximos:</strong> {project.volunteersRequired}</p>

          <button
            onClick={updatePostulationsStatus}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            disabled={selectedPostulations.length === 0}
          >
            Aceptar Seleccionados
          </button>

          <Link to="/project-management" className="mt-4 inline-block bg-gray-500 text-white py-2 px-4 rounded">
            Regresar
          </Link>

          {/* Modal para mostrar el perfil del usuario */}
          {showModal && selectedUser && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Perfil de {selectedUser.name}</h2>

                {/* Imagen del usuario */}
                {selectedUser.photo && (
                  <img
                    src={selectedUser.photo} // Asegúrate de que este campo contenga la URL de la imagen
                    alt={selectedUser.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}

                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Teléfono:</strong> {selectedUser.phone}</p>
                <p><strong>DNI:</strong> {selectedUser.dni}</p> {/* Nuevo campo */}
                <p><strong>Dirección:</strong> {selectedUser.address}</p> {/* Nuevo campo */}
                <p><strong>Rol:</strong> {selectedUser.role}</p> {/* Nuevo campo */}
                <p><strong>Habilidades:</strong> {selectedUser.skills.join(', ')}</p> {/* Nuevo campo */}
                <p><strong>Descripción:</strong> {selectedUser.description || 'No hay descripción disponible.'}</p> {/* Muestra un mensaje por defecto si no hay descripción */}

                <button onClick={closeModal} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Cerrar</button>
              </div>
              <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
            </div>
          )}
        </>
      ) : (
        <p>Proyecto no encontrado.</p>
      )}
    </div>
  );
};

export default ProjectDetails;
