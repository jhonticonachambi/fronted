import React, { useEffect, useState } from 'react';

// Datos simulados (en producción, obtén estos datos desde el backend)
const mockProjects = [
  { id: 1, name: 'Proyecto A', status: 'En progreso', progress: 75, efficiency: 90 },
  { id: 2, name: 'Proyecto B', status: 'Completado', progress: 100, efficiency: 85 },
];

const mockVolunteers = [
  { id: 1, name: 'Carlos', project: 'Proyecto A', tasksCompleted: 5, totalTasks: 8 },
  { id: 2, name: 'Ana', project: 'Proyecto B', tasksCompleted: 10, totalTasks: 10 },
];

const ReportGeneration = () => {
  const [projectsReport, setProjectsReport] = useState([]);
  const [volunteersReport, setVolunteersReport] = useState([]);

  // Función para simular la obtención de reportes de proyectos y voluntarios
  const generateReports = () => {
    // Estado y eficiencia de proyectos
    const projects = mockProjects.map((project) => ({
      ...project,
      progressPercentage: `${project.progress}%`,
      efficiencyRating: `${project.efficiency}%`
    }));
    
    // Progreso de los voluntarios
    const volunteers = mockVolunteers.map((volunteer) => ({
      ...volunteer,
      progress: `${((volunteer.tasksCompleted / volunteer.totalTasks) * 100).toFixed(2)}%`
    }));
    
    setProjectsReport(projects);
    setVolunteersReport(volunteers);
  };

  useEffect(() => {
    generateReports();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Generación de Reportes</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Reporte de Proyectos</h3>
        <ul>
          {projectsReport.map((project) => (
            <li key={project.id} className="p-2 bg-gray-100 rounded mb-2">
              <p><strong>Proyecto:</strong> {project.name}</p>
              <p><strong>Estado:</strong> {project.status}</p>
              <p><strong>Progreso:</strong> {project.progressPercentage}</p>
              <p><strong>Eficiencia:</strong> {project.efficiencyRating}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Reporte de Voluntarios</h3>
        <ul>
          {volunteersReport.map((volunteer) => (
            <li key={volunteer.id} className="p-2 bg-gray-100 rounded mb-2">
              <p><strong>Voluntario:</strong> {volunteer.name}</p>
              <p><strong>Proyecto Asignado:</strong> {volunteer.project}</p>
              <p><strong>Tareas Completadas:</strong> {volunteer.tasksCompleted}/{volunteer.totalTasks}</p>
              <p><strong>Progreso:</strong> {volunteer.progress}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportGeneration;
