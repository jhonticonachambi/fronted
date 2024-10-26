// components/ProjectCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ title, description, status, imageSrc, projectId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/postulation/${projectId}`);
  };

  return (
    <div
      className="project-card bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <img src={imageSrc} alt={title} className="w-full h-32 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>
        <p className="text-gray-500">{status}</p>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Ver Más
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;