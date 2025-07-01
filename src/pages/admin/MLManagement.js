import React, { useState } from 'react';
import { 
  FaBrain, 
  FaChartBar, 
  FaUsers, 
  FaProjectDiagram,
  FaCog,
  FaRobot
} from 'react-icons/fa';
import MLDashboard from '../../components/ml/MLDashboard';
import MLMetricsWidget from '../../components/ml/MLMetricsWidget';

const MLManagement = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    {
      id: 'dashboard',
      name: 'Dashboard Principal',
      icon: FaChartBar,
      description: 'Vista general del sistema ML'
    },
    {
      id: 'metrics',
      name: 'Métricas en Tiempo Real',
      icon: FaBrain,
      description: 'Monitoreo del rendimiento en vivo'
    },
    {
      id: 'models',
      name: 'Gestión de Modelos',
      icon: FaCog,
      description: 'Configuración y entrenamiento'
    },
    {
      id: 'history',
      name: 'Historial de Recomendaciones',
      icon: FaUsers,
      description: 'Registro de asignaciones pasadas'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <MLDashboard />;
      case 'metrics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Métricas en Tiempo Real</h2>
              <MLMetricsWidget className="mb-6" />
              
              {/* Métricas adicionales pueden ir aquí */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Uso de CPU del Modelo</p>
                      <p className="text-2xl font-bold text-blue-900">23%</p>
                    </div>
                    <FaRobot className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Memoria Utilizada</p>
                      <p className="text-2xl font-bold text-green-900">1.2GB</p>
                    </div>
                    <FaChartBar className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Solicitudes/min</p>
                      <p className="text-2xl font-bold text-purple-900">127</p>
                    </div>
                    <FaProjectDiagram className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'models':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestión de Modelos ML</h2>
              
              {/* Información del modelo actual */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Modelo Activo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Nombre del Modelo</p>
                    <p className="text-blue-900">volunteer_recommendation_v2.3</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Última Actualización</p>
                    <p className="text-blue-900">15 de junio, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Precisión del Modelo</p>
                    <p className="text-blue-900">87.3%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Datos de Entrenamiento</p>
                    <p className="text-blue-900">15,420 registros</p>
                  </div>
                </div>
              </div>

              {/* Configuraciones del modelo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Parámetros del Modelo</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Algoritmo:</span>
                      <span className="text-sm font-medium">Random Forest</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Características:</span>
                      <span className="text-sm font-medium">23 variables</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Profundidad máxima:</span>
                      <span className="text-sm font-medium">15 niveles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Validación cruzada:</span>
                      <span className="text-sm font-medium">5-fold</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Métricas de Rendimiento</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Precision:</span>
                      <span className="text-sm font-medium">0.873</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Recall:</span>
                      <span className="text-sm font-medium">0.891</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">F1-Score:</span>
                      <span className="text-sm font-medium">0.882</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">AUC-ROC:</span>
                      <span className="text-sm font-medium">0.924</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Historial de Recomendaciones</h2>
              
              {/* Filtros */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Última semana</option>
                    <option>Último mes</option>
                    <option>Últimos 3 meses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Todos</option>
                    <option>Exitosas</option>
                    <option>Rechazadas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Todos los proyectos</option>
                    <option>Proyecto A</option>
                    <option>Proyecto B</option>
                  </select>
                </div>
              </div>

              {/* Tabla de historial */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proyecto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Voluntarios Recomendados
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asignados
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precisión
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Datos simulados */}
                    {[
                      { date: '2025-07-01', project: 'Limpieza de Playa', recommended: 8, assigned: 5, accuracy: 92, status: 'Completado' },
                      { date: '2025-06-30', project: 'Apoyo Educativo', recommended: 6, assigned: 4, accuracy: 87, status: 'En progreso' },
                      { date: '2025-06-29', project: 'Distribución de Alimentos', recommended: 10, assigned: 7, accuracy: 95, status: 'Completado' },
                    ].map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.project}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.recommended}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.assigned}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.accuracy}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'Completado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return <MLDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FaBrain className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Machine Learning</h1>
                <p className="text-gray-600">Sistema inteligente de recomendaciones de voluntarios</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Secciones</h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeSection === section.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs text-gray-500">{section.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLManagement;
