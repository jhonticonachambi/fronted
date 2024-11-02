// pages/projects.js
import React, { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard';
import axios from 'axios';
import API_URL from '../../config/apiConfig'; // Importar la URL de la API
import '../../assets/styles/Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects`); // Usar la URL de la API
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los proyectos');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Cargando proyectos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="projects-container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Proyectos Disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            projectId={project._id}
            title={project.name}
            description={project.description}
            status="Activo"
            imageSrc={project.bannerImage}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
