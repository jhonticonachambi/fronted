import React, { useState, useEffect } from 'react';
import { 
  FaRobot, 
  FaChartLine, 
  FaSync, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCog,
  FaUsers,
  FaProjectDiagram,
  FaBrain,
  FaCloudUploadAlt
} from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../../config/apiConfig';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MLDashboard = () => {
  const [mlStatus, setMlStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);
  
  // Estados para métricas simuladas (en una implementación real vendrían del backend)
  const [metrics, setMetrics] = useState({
    totalRecommendations: 0,
    successfulAssignments: 0,
    averageAccuracy: 0,
    modelLastTrained: null
  });

  useEffect(() => {
    fetchMLStatus();
    fetchMetrics();
  }, []);

  const fetchMLStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_URL}/volunteer/ml/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMlStatus(response.data);
    } catch (err) {
      console.error('Error fetching ML status:', err);
      setError('Error al obtener el estado del servicio ML');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    // Simulamos métricas por ahora
    // En una implementación real, estas vendrían de un endpoint específico
    setMetrics({
      totalRecommendations: 1250,
      successfulAssignments: 956,
      averageAccuracy: 0.85,
      modelLastTrained: new Date(Date.now() - 86400000 * 7) // Hace 7 días
    });
  };

  const handleRetrain = async () => {
    try {
      setRetraining(true);
      setRetrainResult(null);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/volunteer/ml/retrain`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setRetrainResult({
        success: true,
        message: response.data.message,
        timestamp: response.data.timestamp
      });
      
      // Actualizar estado ML después del reentrenamiento
      await fetchMLStatus();
      await fetchMetrics();
      
    } catch (err) {
      console.error('Error retraining model:', err);
      setRetrainResult({
        success: false,
        message: err.response?.data?.message || 'Error al re-entrenar el modelo'
      });
    } finally {
      setRetraining(false);
    }
  };

  // Datos para gráficos
  const accuracyData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Precisión del Modelo',
        data: [0.82, 0.85, 0.83, 0.87, 0.85, 0.88, 0.85],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const assignmentData = {
    labels: ['Exitosas', 'Rechazadas', 'Pendientes'],
    datasets: [
      {
        data: [metrics.successfulAssignments, 180, 114],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 191, 36, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(251, 191, 36)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const recommendationTrendsData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Recomendaciones Generadas',
        data: [120, 190, 300, 250, 280, 310],
        backgroundColor: 'rgba(147, 51, 234, 0.6)',
      },
      {
        label: 'Asignaciones Exitosas',
        data: [95, 152, 240, 200, 224, 248],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard ML...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <FaBrain className="mr-3" />
              Dashboard de Machine Learning
            </h1>
            <p className="mt-2 opacity-90">
              Monitoreo y gestión del sistema de recomendaciones inteligentes
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-2">
              {mlStatus?.details?.success ? (
                <FaCheckCircle className="text-green-300 mr-2" />
              ) : (
                <FaExclamationTriangle className="text-yellow-300 mr-2" />
              )}
              <span className="font-medium">
                {mlStatus?.details?.success ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <p className="text-sm opacity-75">
              Última actualización: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Estado del Servicio */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaRobot className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estado ML</p>
              <p className="text-2xl font-semibold text-gray-900">
                {mlStatus?.details?.success ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recomendaciones</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.totalRecommendations.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Precisión</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(metrics.averageAccuracy * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FaProjectDiagram className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Asignaciones</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.successfulAssignments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control de Re-entrenamiento */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Re-entrenamiento del Modelo</h3>
            <p className="text-sm text-gray-600">
              Último entrenamiento: {metrics.modelLastTrained?.toLocaleString() || 'Nunca'}
            </p>
          </div>
          <button
            onClick={handleRetrain}
            disabled={retraining}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              retraining
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {retraining ? (
              <>
                <FaSync className="animate-spin mr-2" />
                Re-entrenando...
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="mr-2" />
                Re-entrenar Modelo
              </>
            )}
          </button>
        </div>

        {retrainResult && (
          <div className={`p-4 rounded-lg ${
            retrainResult.success 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              {retrainResult.success ? (
                <FaCheckCircle className="mr-2" />
              ) : (
                <FaExclamationTriangle className="mr-2" />
              )}
              <span className="font-medium">
                {retrainResult.success ? 'Éxito' : 'Error'}
              </span>
            </div>
            <p className="mt-1">{retrainResult.message}</p>
            {retrainResult.timestamp && (
              <p className="text-sm mt-2 opacity-75">
                Completado en: {new Date(retrainResult.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Precisión del Modelo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Precisión del Modelo (7 días)</h3>
          <div className="h-64">
            <Line 
              data={accuracyData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 0.7,
                    max: 1.0
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Distribución de Asignaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Asignaciones</h3>
          <div className="h-64">
            <Doughnut 
              data={assignmentData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Tendencias de Recomendaciones */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tendencias de Recomendaciones (6 meses)</h3>
        <div className="h-64">
          <Bar 
            data={recommendationTrendsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Información del Sistema */}
      {mlStatus?.details && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Sistema ML</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Estado de Conexión</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(mlStatus.details, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Configuración</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{mlStatus.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ${
                    mlStatus.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mlStatus.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última verificación:</span>
                  <span className="font-medium">
                    {new Date(mlStatus.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLDashboard;
