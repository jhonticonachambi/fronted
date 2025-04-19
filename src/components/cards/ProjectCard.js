// components/cards/ProjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';
import { formatDate } from '../../utils/dateUtils';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
      <div className="relative h-48">
        <img 
          src={project.bannerImage || '/default-project-banner.jpg'} 
          alt={project.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-project-banner.jpg';
          }}
        />
        <div className="absolute top-4 right-4">
          <StatusBadge status={project.status} />
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{project.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div>
            <p className="font-medium">Fecha límite</p>
            <p>{formatDate(project.endDate)}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">Voluntarios</p>
            <p>{project.volunteersCount || 0}/{project.volunteersRequired || '∞'}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/proyecto/ver/${project._id}`}
            className="flex-1 text-center py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Ver detalles
          </Link>
          <Link 
            to={`/proyecto/editar/${project._id}`}
            className="flex-1 text-center py-2 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors text-sm"
          >
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;