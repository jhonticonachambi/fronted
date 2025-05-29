import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import API_URL from '../../config/apiConfig';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../ui/StatusBadge';
import { CircularProgress, Alert } from '@mui/material';

const VolunteerTrackingModal = ({ volunteerId, onClose }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/volunteer/seguimiento/${volunteerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.seguimiento) {
          setTrackingData(response.data);
        } else {
          throw new Error('Datos de seguimiento no disponibles');
        }
      } catch (err) {
        console.error('Error fetching tracking data:', err);
        setError(err.response?.data?.message || err.message || 'Error al cargar el seguimiento');
      } finally {
        setLoading(false);
      }
    };

    if (volunteerId) {
      fetchTrackingData();
    }

    return () => {
      // Cleanup si es necesario
    };
  }, [volunteerId]);

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!volunteerId) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">
            {trackingData ? `Seguimiento de ${trackingData.volunteer}` : 'Seguimiento de Voluntario'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress />
            </div>
          ) : error ? (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          ) : trackingData?.seguimiento?.length > 0 ? (
            <div className="space-y-6">
              {trackingData.seguimiento.map((item, index) => (
                <div 
                  key={`tracking-${index}`} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.projectName}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                        <div>
                          <p className="text-sm text-gray-500">Fecha de inicio</p>
                          <p className="font-medium">{formatDate(item.projectDates?.start)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fecha de finalización</p>
                          <p className="font-medium">{formatDate(item.projectDates?.end)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:w-48">
                      <StatusBadge status={item.projectStatus}>Proyecto: {item.projectStatus}</StatusBadge>
                      <StatusBadge status={item.postulationStatus}>Postulación: {item.postulationStatus}</StatusBadge>
                    </div>
                  </div>

                  {item.feedback?.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium text-gray-700 mb-2">Evaluaciones</h5>
                      <ul className="space-y-3">
                        {item.feedback.map((comment, i) => (
                          <li key={`feedback-${i}`} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-800">{comment}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron datos de seguimiento</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

VolunteerTrackingModal.propTypes = {
  volunteerId: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default VolunteerTrackingModal;