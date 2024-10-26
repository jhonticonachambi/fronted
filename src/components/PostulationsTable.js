import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostulationsTable = () => {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostulations = async () => {
      const userId = localStorage.getItem('userId'); // Asegúrate de almacenar el ID del usuario al iniciar sesión
      if (!userId) {
        setError('ID de usuario no encontrado');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://backend-rdf2.onrender.com/api/postulaciones/usuario/${userId}`); // Cambia aquí para incluir el userId en la URL
        setPostulations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las postulaciones');
        setLoading(false);
      }
    };

    fetchPostulations();
  }, []);

  if (loading) {
    return <div>Cargando postulaciones...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Tus Postulaciones Recientes</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Proyecto</th>
            <th className="px-4 py-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {postulations.map((p, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-4 py-2">{p.projectId.name}</td> {/* Muestra el nombre del proyecto */}
              <td className="px-4 py-2">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostulationsTable;
