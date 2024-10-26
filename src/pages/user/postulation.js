import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Postulation = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
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

  const handlePostulation = async () => {
    try {
      await axios.post('https://backend-rdf2.onrender.com/api/postulaciones', {
        projectId: project._id,
        userId: userId,
      });
      alert('Postulación realizada con éxito');
    } catch (err) {
      console.error('Error al realizar la postulación', err);
      alert('Error al realizar la postulación');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-700">Cargando detalles del proyecto...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {project.imageURL && (
        <div className="w-full h-80 bg-gray-200">
          <img src={project.imageURL} alt="Imagen del Proyecto" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-8">
        <h2 className="text-3xl font-semibold text-gray-800">{project.name}</h2>
        <p className="text-gray-600 mt-4 mb-6">{project.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-700"><strong>Requisitos:</strong> {project.requirements}</p>
          <p className="text-gray-700"><strong>Tipo:</strong> {project.type}</p>
          <p className="text-gray-700"><strong>Fecha de Inicio:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
          <p className="text-gray-700"><strong>Fecha de Fin:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
          <p className="text-gray-700"><strong>Voluntarios Requeridos:</strong> {project.volunteersRequired}</p>
          <p className="text-gray-700"><strong>Tipo de Proyecto:</strong> {project.projectType}</p>
        </div>
        <button
          onClick={handlePostulation}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
        >
          Postularse
        </button>
      </div>
    </div>
  );
};

export default Postulation;
