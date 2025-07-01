// pages/admin/recommendations/VolunteerRecommendationsML.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaRobot, FaStar, FaUser, FaUserPlus, FaCheck, FaSpinner } from 'react-icons/fa';
import { addProjectToVolunteerHistory } from '../../../utils/volunteerHistoryAPI';
import axios from 'axios';
import API_URL from '../../../config/apiConfig';

const VolunteerRecommendationsML = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [project, setProject] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningIds, setAssigningIds] = useState(new Set());
  const [assignedIds, setAssignedIds] = useState(new Set());

  useEffect(() => {
    if (projectId) {
      fetchProjectAndRecommendations();
    }
  }, [projectId]);

  const fetchProjectAndRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Obtener datos del proyecto
      const projectResponse = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(projectResponse.data);

      // Obtener recomendaciones de voluntarios
      const recommendationsResponse = await axios.get(
        `${API_URL}/volunteer-profiles/ml/recommendations/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setRecommendations(recommendationsResponse.data.recommendations || []);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar las recomendaciones de voluntarios');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVolunteer = async (volunteer) => {
    const volunteerId = volunteer.user._id || volunteer.user;
    setAssigningIds(prev => new Set([...prev, volunteerId]));

    try {
      await addProjectToVolunteerHistory(volunteerId, projectId, {
        role: 'Voluntario',
        startDate: new Date(),
        completed: false,
        assignmentSource: 'ml_recommendation',
        mlScore: volunteer.score
      });

      setAssignedIds(prev => new Set([...prev, volunteerId]));
      
      // Mostrar notificación de éxito
      alert(`✅ ${volunteer.user.name || 'Voluntario'} ha sido asignado al proyecto exitosamente!`);
      
    } catch (error) {
      console.error('Error assigning volunteer:', error);
      alert('Error al asignar voluntario. Inténtalo de nuevo.');
    } finally {
      setAssigningIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(volunteerId);
        return newSet;
      });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 0.8) return 'Excelente';
    if (score >= 0.6) return 'Bueno';
    return 'Regular';
  };

  const formatScore = (score) => {
    return (score * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generando recomendaciones con IA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <h3 className="font-medium">Error</h3>
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
            >
              Regresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 transition"
            >
              <FaArrowLeft className="mr-2" />
              Regresar
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaRobot className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Recomendaciones de Voluntarios con IA
                </h1>
                <p className="text-gray-600">
                  Sistema de Machine Learning para selección inteligente de voluntarios
                </p>
              </div>
            </div>
            
            {project && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-semibold text-gray-900 mb-2">Proyecto: {project.name}</h2>
                <p className="text-gray-600 text-sm">{project.description}</p>
                <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                  <span>Voluntarios requeridos: {project.volunteersRequired}</span>
                  <span>Fecha límite: {new Date(project.endDate).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Voluntarios Recomendados ({recommendations.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Ordenados por compatibilidad según el análisis de IA
            </p>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-8 text-center">
              <FaRobot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay recomendaciones disponibles
              </h3>
              <p className="text-gray-600">
                El sistema ML no encontró voluntarios compatibles para este proyecto.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recommendations.map((volunteer, index) => {
                const volunteerId = volunteer.user._id || volunteer.user;
                const isAssigning = assigningIds.has(volunteerId);
                const isAssigned = assignedIds.has(volunteerId);
                
                return (
                  <div key={volunteerId} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Ranking */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                            #{index + 1}
                          </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            {volunteer.user.photo ? (
                              <img
                                src={volunteer.user.photo}
                                alt={volunteer.user.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <FaUser className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">
                            {volunteer.user.name || 'Voluntario'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {volunteer.user.email}
                          </p>
                          
                          {/* Skills */}
                          {volunteer.skills && volunteer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {volunteer.skills.slice(0, 3).map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                              {volunteer.skills.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{volunteer.skills.length - 3} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(volunteer.score)}`}>
                            <FaStar className="mr-1" />
                            {formatScore(volunteer.score)}%
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {getScoreLabel(volunteer.score)}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 ml-4">
                        {isAssigned ? (
                          <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg text-sm">
                            <FaCheck className="mr-2" />
                            <span>Asignado</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAssignVolunteer(volunteer)}
                            disabled={isAssigning}
                            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-4 py-2 rounded-lg transition text-sm"
                          >
                            {isAssigning ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                <span>Asignando...</span>
                              </>
                            ) : (
                              <>
                                <FaUserPlus />
                                <span>Asignar</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Additional Info */}
                    {volunteer.reasons && volunteer.reasons.length > 0 && (
                      <div className="mt-4 pl-16">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Razones de la recomendación:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {volunteer.reasons.map((reason, reasonIndex) => (
                            <li key={reasonIndex} className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerRecommendationsML;
