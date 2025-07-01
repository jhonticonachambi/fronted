// components/VolunteerHistoryList.js
import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaCheck, FaClock, FaEye } from 'react-icons/fa';
import { getVolunteerHistory } from '../utils/volunteerHistoryAPI';

const VolunteerHistoryList = ({ volunteerId, showDetails = true }) => {
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (volunteerId) {
      fetchVolunteerHistory();
    }
  }, [volunteerId]);

  const fetchVolunteerHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVolunteerHistory(volunteerId);
      setVolunteerData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!volunteerData || !volunteerData.projectHistory || volunteerData.projectHistory.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaUser className="mx-auto h-12 w-12 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium">Sin historial de proyectos</h3>
        <p>Este voluntario aún no ha sido asignado a ningún proyecto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            {volunteerData.user?.name || 'Voluntario'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Proyectos:</span>
              <div className="font-semibold">{volunteerData.totalProjects || 0}</div>
            </div>
            <div>
              <span className="text-gray-600">Completados:</span>
              <div className="font-semibold text-green-600">{volunteerData.completedProjects || 0}</div>
            </div>
            <div>
              <span className="text-gray-600">Tasa de Éxito:</span>
              <div className="font-semibold">
                {volunteerData.successRate ? `${(volunteerData.successRate * 100).toFixed(1)}%` : '0%'}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Horas Totales:</span>
              <div className="font-semibold">{volunteerData.totalHours || 0}h</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-900">Historial de Proyectos</h4>
        
        {volunteerData.projectHistory.map((projectEntry, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">
                  {projectEntry.project?.name || 'Proyecto sin nombre'}
                </h5>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>Inicio: {formatDate(projectEntry.startDate)}</span>
                  </div>
                  
                  {projectEntry.endDate && (
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      <span>Fin: {formatDate(projectEntry.endDate)}</span>
                    </div>
                  )}
                  
                  {projectEntry.role && (
                    <div className="flex items-center">
                      <FaUser className="mr-1" />
                      <span>{projectEntry.role}</span>
                    </div>
                  )}
                </div>

                {projectEntry.project?.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {projectEntry.project.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {projectEntry.completed ? (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                    <FaCheck className="mr-1" />
                    <span>Completado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
                    <FaClock className="mr-1" />
                    <span>En Progreso</span>
                  </div>
                )}
                
                {projectEntry.performance && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Desempeño:</span> {projectEntry.performance}/10
                  </div>
                )}
              </div>
            </div>

            {projectEntry.feedback && (
              <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <h6 className="text-sm font-medium text-gray-900">Feedback:</h6>
                <p className="text-sm text-gray-700 mt-1">{projectEntry.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerHistoryList;
