import React, { useState, useEffect } from 'react';
import { 
  FaRobot, 
  FaChartLine, 
  FaUsers, 
  FaCheckCircle, 
  FaClock,
  FaBrain,
  FaSync,
  FaInfoCircle
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MLMetricsWidget = ({ className = "" }) => {
  const [metrics, setMetrics] = useState({
    isOnline: false,
    totalRecommendations: 0,
    successfulAssignments: 0,
    averageAccuracy: 0,
    responseTime: 0,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchMLMetrics();
    
    // Actualizar métricas cada 30 segundos
    const interval = setInterval(fetchMLMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchMLMetrics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Verificar estado del servicio ML
      const statusResponse = await axios.get(
        `${API_URL}/volunteer/ml/status`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Simular métricas (en una implementación real, estas vendrían del backend)
      const simulatedMetrics = {
        isOnline: statusResponse.data.details?.success || false,
        totalRecommendations: Math.floor(Math.random() * 100) + 1200,
        successfulAssignments: Math.floor(Math.random() * 50) + 950,
        averageAccuracy: 0.82 + (Math.random() * 0.1),
        responseTime: Math.floor(Math.random() * 200) + 150,
        lastUpdated: new Date()
      };
      
      setMetrics(simulatedMetrics);
      
      // Actualizar datos de rendimiento
      updatePerformanceChart();
      
    } catch (err) {
      console.error('Error fetching ML metrics:', err);
      setMetrics(prev => ({
        ...prev,
        isOnline: false,
        lastUpdated: new Date()
      }));
    } finally {
      setLoading(false);
    }
  };

  const updatePerformanceChart = () => {
    const now = new Date();
    const labels = [];
    const accuracyData = [];
    
    // Generar datos de las últimas 24 horas
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.getHours().toString().padStart(2, '0') + ':00');
      
      // Simular datos de precisión con variaciones realistas
      const baseAccuracy = 0.85;
      const variation = (Math.random() - 0.5) * 0.1;
      accuracyData.push(Math.max(0.7, Math.min(1.0, baseAccuracy + variation)));
    }
    
    setPerformanceData({
      labels,
      datasets: [
        {
          label: 'Precisión del Modelo (%)',
          data: accuracyData.map(val => val * 100),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    });
  };

  const formatTime = (date) => {
    return date ? new Date(date).toLocaleTimeString() : 'N/A';
  };

  const getStatusColor = (isOnline) => {
    return isOnline ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBg = (isOnline) => {
    return isOnline ? 'bg-green-100' : 'bg-red-100';
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaBrain className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Estado ML en Tiempo Real</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center px-2 py-1 rounded-full ${getStatusBg(metrics.isOnline)}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                metrics.isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-xs font-medium ${getStatusColor(metrics.isOnline)}`}>
                {metrics.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <button
              onClick={fetchMLMetrics}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Actualizar métricas"
            >
              <FaSync className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Métricas principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
              <FaChartLine className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Recomendaciones</p>
            <p className="text-lg font-semibold text-gray-900">
              {metrics.totalRecommendations.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
              <FaCheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Asignaciones</p>
            <p className="text-lg font-semibold text-gray-900">
              {metrics.successfulAssignments.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mx-auto mb-2">
              <FaRobot className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Precisión</p>
            <p className="text-lg font-semibold text-gray-900">
              {(metrics.averageAccuracy * 100).toFixed(1)}%
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full mx-auto mb-2">
              <FaClock className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-xs text-gray-600">Respuesta</p>
            <p className="text-lg font-semibold text-gray-900">
              {metrics.responseTime}ms
            </p>
          </div>
        </div>

        {/* Gráfico de rendimiento */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Precisión (24h)</h4>
          <div className="h-32">
            <Line 
              data={performanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  }
                },
                scales: {
                  x: {
                    display: true,
                    grid: {
                      display: false
                    },
                    ticks: {
                      maxTicksLimit: 6,
                      font: {
                        size: 10
                      }
                    }
                  },
                  y: {
                    display: true,
                    min: 70,
                    max: 100,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                      font: {
                        size: 10
                      },
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                },
                interaction: {
                  mode: 'nearest',
                  axis: 'x',
                  intersect: false
                }
              }}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <FaInfoCircle className="mr-1" />
              <span>Última actualización: {formatTime(metrics.lastUpdated)}</span>
            </div>
            <div className="flex items-center">
              <span>Tasa de éxito: </span>
              <span className="ml-1 font-medium text-gray-700">
                {metrics.totalRecommendations > 0 
                  ? ((metrics.successfulAssignments / metrics.totalRecommendations) * 100).toFixed(1) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLMetricsWidget;
