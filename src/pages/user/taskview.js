import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../config/apiConfig';

const TaskView = () => {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || "Usuario";

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const projectResponse = await axios.get(`${API_URL}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProject(projectResponse.data);

        const tasksResponse = await axios.get(`${API_URL}/tasks/${userId}/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(tasksResponse.data);
      } catch (err) {
        setError('Error al cargar los detalles del proyecto o las tareas asignadas');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [projectId, userId]);

  if (loading) return <p>Cargando detalles del proyecto...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">🌞 Buenas tardes, {userName}</h1>
      </header>

      {project ? (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-semibold">Detalles del Proyecto</h2>
            <div className="bg-white p-6 rounded-lg shadow mt-4">
              <h3 className="text-lg font-bold">{project.name}</h3>
              {project.bannerImage && (
                <img
                  src={project.bannerImage}
                  alt={project.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <p><strong>Descripción:</strong> {project.description}</p>
              <p><strong>Fecha de Inicio:</strong> {project.startDate}</p>
              <p><strong>Fecha de Fin:</strong> {project.endDate}</p>
              <p><strong>Voluntarios Requeridos:</strong> {project.volunteersRequired}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Tareas Asignadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task._id} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">{task.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'Not Started' ? 'bg-pink-100 text-pink-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full">No hay tareas asignadas para este proyecto.</p>
              )}
            </div>
          </section>

          <div className="mt-6">
            <Link to="/lista-proyectos" className="bg-gray-500 text-white py-2 px-4 rounded">
              Regresar a Proyectos
            </Link>
          </div>
        </>
      ) : (
        <p>Proyecto no encontrado.</p>
      )}
    </div>
  );
};

export default TaskView;
