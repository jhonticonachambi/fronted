import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Postulation = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(''); // Estado para almacenar el _id del usuario
  const navigate = useNavigate(); // Para redirigir si es necesario

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage

    if (!token) {
      navigate('/login'); // Redirige al login si no hay token
    } else {
      const storedUserId = localStorage.getItem('userId'); // Obtén el _id del usuario
      setUserId(storedUserId); // Establece el _id del usuario en el estado
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`https://backend-rdf2.onrender.com/api/projects/${projectId}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del proyecto');
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  // Función para manejar la postulación
  const handlePostulation = async () => {
    try {
      await axios.post('https://backend-rdf2.onrender.com/api/postulaciones', {
        projectId: project._id,
        userId: userId,
      });
      alert('Postulación realizada con éxito');
      // Redirigir o realizar otra acción después de la postulación
    } catch (err) {
      console.error('Error al realizar la postulación', err);
      alert('Error al realizar la postulación');
    }
  };

  if (loading) {
    return <div>Cargando detalles del proyecto...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="postulation-details-container">
      <h1>Detalles del Proyecto</h1>
      <h2>ID del Proyecto: {project._id}</h2>
      <h3>Nombre: {project.name}</h3>
      <p>Descripción: {project.description}</p>
      <p>Requisitos: {project.requirements}</p>
      <p>Tipo: {project.type}</p>
      <p>Fecha de Inicio: {new Date(project.startDate).toLocaleDateString()}</p>
      <p>Fecha de Fin: {new Date(project.endDate).toLocaleDateString()}</p>
      <p>Voluntarios Requeridos: {project.volunteersRequired}</p>
      <p>Tipo de Proyecto: {project.projectType}</p>
      <h2>ID del Usuario Actual: {userId}</h2> {/* Muestra el _id del usuario */}

      {/* Botón para realizar la postulación */}
      <button onClick={handlePostulation} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Postularse
      </button>
    </div>
  );
};

export default Postulation;
