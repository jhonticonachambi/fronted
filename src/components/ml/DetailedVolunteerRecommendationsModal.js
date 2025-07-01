import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaRobot, 
  FaStar, 
  FaUser, 
  FaUserPlus, 
  FaCheck, 
  FaSpinner,
  FaChartBar,
  FaEye,
  FaBrain,
  FaInfoCircle,
  FaFilter,
  FaSort
} from 'react-icons/fa';
import { Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import API_URL from '../../config/apiConfig';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const DetailedVolunteerRecommendationsModal = ({ 
  projectId, 
  projectName, 
  onClose, 
  onVolunteerAssigned 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [sortBy, setSortBy] = useState('score');
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [assigningIds, setAssigningIds] = useState(new Set());
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchDetailedRecommendations();
    }
  }, [projectId]);

  const fetchDetailedRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_URL}/volunteer/ml/detailed-recommendations/${projectId}?includeAnalysis=true&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setRecommendations(response.data.recommendations || []);
      setAnalysis(response.data.analysis || null);
      
    } catch (err) {
      console.error('Error fetching detailed recommendations:', err);
      setError('Error al cargar las recomendaciones detalladas');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVolunteer = async (volunteer) => {
    const volunteerId = volunteer.user._id || volunteer.user;
    setAssigningIds(prev => new Set([...prev, volunteerId]));

    try {
      // Aquí llamarías a la API de asignación inteligente
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_URL}/volunteer/ml/assign/${projectId}`,
        {
          volunteerIds: [volunteerId],
          notifyVolunteers: true
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setAssignedIds(prev => new Set([...prev, volunteerId]));
      
      if (onVolunteerAssigned) {
        onVolunteerAssigned(volunteer);
      }

    } catch (err) {
      console.error('Error assigning volunteer:', err);
      alert('Error al asignar voluntario');
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

  // Filtrar y ordenar recomendaciones
  const filteredRecommendations = recommendations
    .filter(volunteer => volunteer.score >= filterMinScore)
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'name':
          return (a.user.name || '').localeCompare(b.user.name || '');
        case 'experience':
          return (b.metrics?.completedProjects || 0) - (a.metrics?.completedProjects || 0);
        default:
          return b.score - a.score;
      }
    });

  // Datos para gráfico de análisis
  const analysisChartData = analysis ? {
    labels: ['Puntuación Alta (>80%)', 'Puntuación Media (60-80%)', 'Puntuación Baja (<60%)'],
    datasets: [
      {
        label: 'Distribución de Voluntarios',
        data: [
          analysis.scoreDistribution?.high || 0,
          analysis.scoreDistribution?.medium || 0,
          analysis.scoreDistribution?.low || 0
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(251, 191, 36, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Datos para gráfico radar del voluntario seleccionado
  const getVolunteerRadarData = (volunteer) => ({
    labels: ['Confiabilidad', 'Puntualidad', 'Calidad', 'Experiencia', 'Compatibilidad'],
    datasets: [
      {
        label: volunteer.user.name,
        data: [
          (volunteer.metrics?.reliability || 5) / 10,
          (volunteer.metrics?.punctuality || 5) / 10,
          (volunteer.metrics?.taskQuality || 5) / 10,
          Math.min((volunteer.metrics?.completedProjects || 0) / 10, 1),
          volunteer.score
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(147, 51, 234, 1)',
      },
    ],
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center">
            <FaBrain className="h-6 w-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">
                Análisis ML Detallado - "{projectName}"
              </h3>
              <p className="text-sm opacity-90">
                Recomendaciones inteligentes con análisis profundo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaUser className="inline mr-2" />
            Recomendaciones ({filteredRecommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FaChartBar className="inline mr-2" />
            Análisis General
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Generando análisis con IA...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <>
              {activeTab === 'recommendations' && (
                <div className="space-y-6">
                  {/* Controles */}
                  <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <FaFilter className="text-gray-500" />
                        <label className="text-sm font-medium text-gray-700">
                          Puntuación mínima:
                        </label>
                        <select
                          value={filterMinScore}
                          onChange={(e) => setFilterMinScore(parseFloat(e.target.value))}
                          className="border border-gray-300 rounded px-3 py-1 text-sm"
                        >
                          <option value={0}>Todas</option>
                          <option value={0.5}>50%+</option>
                          <option value={0.6}>60%+</option>
                          <option value={0.7}>70%+</option>
                          <option value={0.8}>80%+</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <FaSort className="text-gray-500" />
                        <label className="text-sm font-medium text-gray-700">
                          Ordenar por:
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1 text-sm"
                        >
                          <option value="score">Puntuación</option>
                          <option value="name">Nombre</option>
                          <option value="experience">Experiencia</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Mostrando {filteredRecommendations.length} de {recommendations.length} voluntarios
                    </div>
                  </div>

                  {/* Lista de Recomendaciones */}
                  <div className="grid gap-4">
                    {filteredRecommendations.map((volunteer, index) => {
                      const volunteerId = volunteer.user._id || volunteer.user;
                      const isAssigning = assigningIds.has(volunteerId);
                      const isAssigned = assignedIds.has(volunteerId);
                      
                      return (
                        <div key={volunteerId} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              {/* Avatar */}
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <FaUser className="text-purple-600" />
                              </div>
                              
                              {/* Información del voluntario */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {volunteer.user.name || 'Sin nombre'}
                                  </h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(volunteer.score)}`}>
                                    {(volunteer.score * 100).toFixed(0)}% - {getScoreLabel(volunteer.score)}
                                  </span>
                                  <span className="text-xs text-gray-500">#{index + 1}</span>
                                </div>
                                
                                {/* Razones */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {volunteer.reasons?.slice(0, 3).map((reason, idx) => (
                                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                      {reason}
                                    </span>
                                  ))}
                                </div>
                                
                                {/* Métricas */}
                                <div className="grid grid-cols-4 gap-4 text-xs text-gray-600">
                                  <div>
                                    <span className="font-medium">Confiabilidad:</span> {volunteer.metrics?.reliability || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Puntualidad:</span> {volunteer.metrics?.punctuality || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Calidad:</span> {volunteer.metrics?.taskQuality || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Proyectos:</span> {volunteer.metrics?.completedProjects || 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Acciones */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedVolunteer(volunteer)}
                                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                                title="Ver análisis detallado"
                              >
                                <FaEye />
                              </button>
                              
                              {isAssigned ? (
                                <div className="flex items-center text-green-600 px-3 py-2 bg-green-50 rounded">
                                  <FaCheck className="mr-2" />
                                  Asignado
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAssignVolunteer(volunteer)}
                                  disabled={isAssigning}
                                  className={`flex items-center px-4 py-2 rounded font-medium transition-colors ${
                                    isAssigning
                                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      : 'bg-purple-600 text-white hover:bg-purple-700'
                                  }`}
                                >
                                  {isAssigning ? (
                                    <>
                                      <FaSpinner className="animate-spin mr-2" />
                                      Asignando...
                                    </>
                                  ) : (
                                    <>
                                      <FaUserPlus className="mr-2" />
                                      Asignar
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && analysis && (
                <div className="space-y-6">
                  {/* Métricas generales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Puntuación Promedio</h4>
                      <p className="text-3xl font-bold text-blue-700">
                        {(analysis.averageScore * 100).toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Candidatos Ideales</h4>
                      <p className="text-3xl font-bold text-green-700">
                        {analysis.scoreDistribution?.high || 0}
                      </p>
                      <p className="text-sm text-green-600">Puntuación &gt; 80%</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Total Evaluados</h4>
                      <p className="text-3xl font-bold text-purple-700">
                        {recommendations.length}
                      </p>
                    </div>
                  </div>
                  
                  {/* Gráfico de distribución */}
                  {analysisChartData && (
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Distribución de Puntuaciones</h4>
                      <div className="h-64">
                        <Bar 
                          data={analysisChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Principales razones */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Principales Factores de Recomendación</h4>
                    <div className="space-y-2">
                      {analysis.topReasons?.map((reason, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-gray-700">{reason}</span>
                          <FaInfoCircle className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal para análisis individual del voluntario */}
        {selectedVolunteer && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  Análisis Detallado - {selectedVolunteer.user.name}
                </h3>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Perfil de Competencias</h4>
                  <div className="h-64">
                    <Radar 
                      data={getVolunteerRadarData(selectedVolunteer)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            beginAtZero: true,
                            max: 1,
                            ticks: {
                              stepSize: 0.2
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Fortalezas</h5>
                    <ul className="space-y-1">
                      {selectedVolunteer.reasons?.map((reason, idx) => (
                        <li key={idx} className="text-green-600 flex items-center">
                          <FaCheck className="mr-2 text-xs" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Métricas</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Puntuación General:</span>
                        <span className="font-medium">{(selectedVolunteer.score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Proyectos Completados:</span>
                        <span className="font-medium">{selectedVolunteer.metrics?.completedProjects || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasa de Éxito:</span>
                        <span className="font-medium">{((selectedVolunteer.metrics?.successRate || 0) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedVolunteerRecommendationsModal;
