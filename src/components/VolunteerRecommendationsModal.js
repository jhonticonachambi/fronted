// components/VolunteerRecommendationsModal.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaRobot, FaStar, FaUser, FaUserPlus, FaCheck, FaSpinner, FaBrain, FaEye } from 'react-icons/fa';
import { addProjectToVolunteerHistory } from '../utils/volunteerHistoryAPI';
import axios from 'axios';
import API_URL from '../config/apiConfig';
import { DetailedVolunteerRecommendationsModal, SmartAssignmentModal } from './ml';

const VolunteerRecommendationsModal = ({ projectId, projectName, onClose, onVolunteerAssigned }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigningIds, setAssigningIds] = useState(new Set());
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [showDetailedModal, setShowDetailedModal] = useState(false);
  const [showSmartAssignment, setShowSmartAssignment] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchRecommendations();
    }
  }, [projectId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Fetching recommendations for project:', projectId);
      console.log('Token available:', !!token);
      console.log('API URL:', `${API_URL}/volunteer/ml/recommendations/${projectId}`);
      
      const response = await axios.get(
        `${API_URL}/volunteer/ml/recommendations/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('ML Recommendations response:', response.data);
      setRecommendations(response.data.recommendations || []);
      
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      if (err.response?.status === 401) {
        setError('Error de autenticación. Por favor, inicia sesión nuevamente.');
      } else {
        setError(`Error al cargar las recomendaciones: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVolunteer = async (volunteer) => {
    // Manejar tanto la estructura del ML service como la básica
    const userData = volunteer.user || {};
    const volunteerId = userData._id;
    
    if (!volunteerId) {
      console.error('No se puede asignar voluntario sin ID:', volunteer);
      alert('Error: No se puede asignar este voluntario. Información incompleta.');
      return;
    }
    
    setAssigningIds(prev => new Set([...prev, volunteerId]));

    try {
      await addProjectToVolunteerHistory(volunteerId, projectId, {
        role: 'Voluntario',
        startDate: new Date(),
        completed: false,
        assignmentSource: 'ml_recommendation',
        mlScore: volunteer.score || 0
      });

      setAssignedIds(prev => new Set([...prev, volunteerId]));
      
      // Callback para notificar al componente padre
      if (onVolunteerAssigned) {
        onVolunteerAssigned(volunteer);
      }
      
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaRobot className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Recomendaciones ML para "{projectName}"
              </h3>
              <p className="text-sm text-gray-600">
                Voluntarios ordenados por compatibilidad según IA
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetailedModal(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              title="Análisis detallado con IA"
            >
              <FaBrain className="mr-2 h-4 w-4" />
              Análisis IA
            </button>
            <button
              onClick={() => setShowSmartAssignment(true)}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
              title="Asignación inteligente automática"
            >
              <FaRobot className="mr-2 h-4 w-4" />
              Auto-Asignar
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Generando recomendaciones con IA...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8">
              <FaRobot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay recomendaciones disponibles
              </h3>
              <p className="text-gray-600">
                El sistema ML no encontró voluntarios compatibles para este proyecto.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => {
                // Manejar tanto la estructura del ML service como la básica
                const volunteerData = recommendation.volunteer || recommendation;
                const userData = volunteerData.user || {};
                
                // Validar que tengamos datos mínimos
                if (!userData || !userData._id) {
                  console.warn('Volunteer data missing user info:', recommendation);
                  return null;
                }

                const volunteerId = userData._id;
                const isAssigning = assigningIds.has(volunteerId);
                const isAssigned = assignedIds.has(volunteerId);
                
                return (
                  <div key={volunteerId} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
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
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {userData.photo ? (
                              <img
                                src={userData.photo}
                                alt={userData.name || 'Voluntario'}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <FaUser className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">
                            {userData.name || 'Voluntario'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {userData.email || 'Email no disponible'}
                          </p>
                          
                          {/* Skills */}
                          {volunteerData.skills && volunteerData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {volunteerData.skills.slice(0, 2).map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                              {volunteerData.skills.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{volunteerData.skills.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-center">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(recommendation.score || 0)}`}>
                            <FaStar className="mr-1" />
                            {formatScore(recommendation.score || 0)}%
                          </div>
                          <p className="text-xs text-gray-500">
                            {getScoreLabel(recommendation.score || 0)}
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
                            onClick={() => handleAssignVolunteer({ 
                              user: userData, 
                              score: recommendation.score || 0,
                              ...volunteerData 
                            })}
                            disabled={isAssigning}
                            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-3 py-2 rounded-lg transition text-sm"
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

                    {/* Reasons */}
                    {(recommendation.reasons || recommendation.prediction?.message) && (
                      <div className="mt-3 pl-12">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">
                          Razones de la recomendación:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {recommendation.reasons ? (
                            recommendation.reasons.slice(0, 2).map((reason, reasonIndex) => (
                              <li key={reasonIndex} className="flex items-start">
                                <span className="text-purple-500 mr-1">•</span>
                                <span>{reason}</span>
                              </li>
                            ))
                          ) : recommendation.prediction?.message ? (
                            <li className="flex items-start">
                              <span className="text-purple-500 mr-1">•</span>
                              <span>{recommendation.prediction.message}</span>
                            </li>
                          ) : null}
                          {recommendation.reasons && recommendation.reasons.length > 2 && (
                            <li className="text-gray-500">
                              ... y {recommendation.reasons.length - 2} razones más
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }).filter(Boolean)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
      
      {/* Modales ML Avanzados */}
      {showDetailedModal && (
        <DetailedVolunteerRecommendationsModal
          projectId={projectId}
          projectName={projectName}
          onClose={() => setShowDetailedModal(false)}
          onVolunteerAssigned={onVolunteerAssigned}
        />
      )}
      
      {showSmartAssignment && (
        <SmartAssignmentModal
          projectId={projectId}
          projectName={projectName}
          onClose={() => setShowSmartAssignment(false)}
          onAssignmentComplete={(result) => {
            console.log('Smart assignment completed:', result);
            setShowSmartAssignment(false);
            if (onVolunteerAssigned) {
              // Notificar sobre las asignaciones
              result.results?.filter(r => r.assigned).forEach(assignment => {
                onVolunteerAssigned({ user: { _id: assignment.volunteerId, name: assignment.volunteerName } });
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default VolunteerRecommendationsModal;
