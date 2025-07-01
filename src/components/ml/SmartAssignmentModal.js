import React, { useState } from 'react';
import { 
  FaRobot, 
  FaUsers, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaSpinner,
  FaCog,
  FaLightbulb,
  FaArrowRight,
  FaTimes
} from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../../config/apiConfig';

const SmartAssignmentModal = ({ 
  projectId, 
  projectName, 
  onClose, 
  onAssignmentComplete 
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState(null);
  const [settings, setSettings] = useState({
    maxVolunteers: 5,
    minScore: 0.7,
    criteria: 'balanced',
    notifyVolunteers: true,
    autoAssign: true
  });

  const handleSmartAssignment = async () => {
    try {
      setIsAssigning(true);
      setAssignmentResult(null);
      
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/volunteer/ml/assign/${projectId}`,
        {
          autoAssign: settings.autoAssign,
          maxVolunteers: settings.maxVolunteers,
          minScore: settings.minScore,
          criteria: settings.criteria,
          notifyVolunteers: settings.notifyVolunteers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setAssignmentResult(response.data);
      
      if (onAssignmentComplete) {
        onAssignmentComplete(response.data);
      }
      
    } catch (err) {
      console.error('Error in smart assignment:', err);
      setAssignmentResult({
        error: true,
        message: err.response?.data?.message || 'Error en la asignación inteligente'
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const getCriteriaDescription = (criteria) => {
    switch (criteria) {
      case 'performance':
        return 'Prioriza voluntarios con mejores métricas de rendimiento';
      case 'availability':
        return 'Prioriza voluntarios con mayor disponibilidad de tiempo';
      case 'balanced':
        return 'Balance entre rendimiento, disponibilidad y compatibilidad';
      default:
        return 'Criterio de selección personalizado';
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 0.8) return { label: 'Excelente', color: 'text-green-600' };
    if (score >= 0.7) return { label: 'Muy Bueno', color: 'text-blue-600' };
    if (score >= 0.6) return { label: 'Bueno', color: 'text-yellow-600' };
    return { label: 'Regular', color: 'text-red-600' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center">
            <FaRobot className="h-6 w-6 mr-3" />
            <div>
              <h3 className="text-lg font-semibold">
                Asignación Inteligente de Voluntarios
              </h3>
              <p className="text-sm opacity-90">
                IA seleccionará automáticamente los mejores voluntarios para "{projectName}"
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

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {!assignmentResult ? (
            <div className="space-y-6">
              {/* Configuración */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCog className="mr-2 text-blue-600" />
                  Configuración de Asignación
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Número máximo de voluntarios */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número máximo de voluntarios
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={settings.maxVolunteers}
                      onChange={(e) => setSettings({...settings, maxVolunteers: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cantidad óptima de voluntarios para el proyecto
                    </p>
                  </div>

                  {/* Puntuación mínima */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puntuación mínima requerida
                    </label>
                    <select
                      value={settings.minScore}
                      onChange={(e) => setSettings({...settings, minScore: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0.5}>50% - Estándar básico</option>
                      <option value={0.6}>60% - Estándar bueno</option>
                      <option value={0.7}>70% - Estándar alto</option>
                      <option value={0.8}>80% - Excelencia</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Solo voluntarios con esta puntuación o superior serán considerados
                    </p>
                  </div>

                  {/* Criterio de selección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Criterio de selección
                    </label>
                    <select
                      value={settings.criteria}
                      onChange={(e) => setSettings({...settings, criteria: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="balanced">Balanceado</option>
                      <option value="performance">Alto rendimiento</option>
                      <option value="availability">Mayor disponibilidad</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {getCriteriaDescription(settings.criteria)}
                    </p>
                  </div>

                  {/* Opciones adicionales */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Opciones adicionales
                    </label>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notifyVolunteers"
                        checked={settings.notifyVolunteers}
                        onChange={(e) => setSettings({...settings, notifyVolunteers: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifyVolunteers" className="ml-2 text-sm text-gray-700">
                        Notificar a voluntarios seleccionados
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoAssign"
                        checked={settings.autoAssign}
                        onChange={(e) => setSettings({...settings, autoAssign: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoAssign" className="ml-2 text-sm text-gray-700">
                        Asignación automática (sin confirmación manual)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del proceso */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <FaLightbulb className="text-yellow-600 mt-1 mr-3" />
                  <div>
                    <h5 className="font-medium text-yellow-800">¿Cómo funciona la asignación inteligente?</h5>
                    <p className="text-sm text-yellow-700 mt-1">
                      El sistema de IA analizará todos los voluntarios disponibles considerando sus habilidades, 
                      experiencia previa, métricas de rendimiento y compatibilidad con el proyecto. Los voluntarios 
                      seleccionados serán aquellos con mayor probabilidad de éxito en el proyecto.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSmartAssignment}
                  disabled={isAssigning}
                  className={`flex items-center px-6 py-2 rounded-md font-medium transition-colors ${
                    isAssigning
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {isAssigning ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <FaRobot className="mr-2" />
                      Iniciar Asignación Inteligente
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resultado de la asignación */}
              {assignmentResult.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FaExclamationTriangle className="text-red-600 mr-3" />
                    <h4 className="text-lg font-semibold text-red-900">Error en la Asignación</h4>
                  </div>
                  <p className="text-red-700">{assignmentResult.message}</p>
                  <button
                    onClick={() => setAssignmentResult(null)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Intentar de Nuevo
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Header del resultado */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <FaCheckCircle className="text-green-600 mr-3" />
                      <h4 className="text-lg font-semibold text-green-900">
                        Asignación Completada Exitosamente
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-800">Voluntarios evaluados:</span>
                        <p className="text-green-700">{assignmentResult.summary?.totalEvaluated || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Asignaciones exitosas:</span>
                        <p className="text-green-700">{assignmentResult.summary?.successful || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Puntuación promedio:</span>
                        <p className="text-green-700">
                          {((assignmentResult.summary?.averageScore || 0) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de voluntarios asignados */}
                  <div className="bg-white border rounded-lg">
                    <div className="px-6 py-4 border-b bg-gray-50">
                      <h5 className="font-semibold text-gray-900 flex items-center">
                        <FaUsers className="mr-2" />
                        Voluntarios Seleccionados ({assignmentResult.results?.filter(r => r.assigned).length || 0})
                      </h5>
                    </div>
                    <div className="divide-y">
                      {assignmentResult.results?.filter(r => r.assigned).map((result, index) => {
                        const scoreData = getScoreLabel(result.score);
                        return (
                          <div key={result.volunteerId} className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h6 className="font-medium text-gray-900">
                                    {result.volunteerName || 'Voluntario'}
                                  </h6>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${scoreData.color} bg-gray-100`}>
                                    {(result.score * 100).toFixed(0)}% - {scoreData.label}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {result.reasons?.slice(0, 3).map((reason, idx) => (
                                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                      {reason}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="ml-4">
                                <FaCheckCircle className="text-green-600" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Voluntarios no asignados (si los hay) */}
                  {assignmentResult.results?.filter(r => !r.assigned).length > 0 && (
                    <div className="bg-white border rounded-lg">
                      <div className="px-6 py-4 border-b bg-gray-50">
                        <h5 className="font-semibold text-gray-900">
                          Voluntarios No Seleccionados ({assignmentResult.results.filter(r => !r.assigned).length})
                        </h5>
                      </div>
                      <div className="divide-y">
                        {assignmentResult.results.filter(r => !r.assigned).slice(0, 5).map((result, index) => (
                          <div key={result.volunteerId} className="p-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h6 className="font-medium text-gray-700">
                                  {result.volunteerName || 'Voluntario'}
                                </h6>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {result.warnings?.map((warning, idx) => (
                                    <span key={idx} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                                      {warning}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {(result.score * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información del servicio ML */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <FaRobot className="text-blue-600 mt-1 mr-3" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">Información del Proceso</p>
                        <p className="text-blue-700 mt-1">
                          Tipo de asignación: {assignmentResult.assignmentType === 'automatic' ? 'Automática' : 'Manual'}
                        </p>
                        <p className="text-blue-700">
                          Servicio ML: {assignmentResult.mlService === 'available' ? 'Disponible' : 'Modo de respaldo'}
                        </p>
                        <p className="text-blue-700">
                          Procesado en: {new Date(assignmentResult.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setAssignmentResult(null)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Nueva Asignación
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Finalizar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartAssignmentModal;
