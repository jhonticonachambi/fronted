import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../../../../config/apiConfig';

const DeleteEventModal = ({ event, onClose, onEventDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const attendeeCount = event.attendees?.length || 0;
  const hasAttendees = attendeeCount > 0;

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_URL}/events/${event._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      onEventDeleted();
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Error al eliminar el evento. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-semibold text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Eliminar Evento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Warning Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Event Info */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Estás seguro de que quieres eliminar este evento?
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-medium text-gray-900">{event.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{formatDate(event.eventDate)}</p>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>
          </div>

          {/* Warnings */}
          <div className="space-y-3 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Esta acción no se puede deshacer
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    El evento será eliminado permanentemente del sistema.
                  </p>
                </div>
              </div>
            </div>

            {hasAttendees && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <FaExclamationTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">
                      Este evento tiene {attendeeCount} asistente{attendeeCount !== 1 ? 's' : ''} registrado{attendeeCount !== 1 ? 's' : ''}
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      Se enviará una notificación de cancelación a todos los asistentes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation Text */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Escribe <span className="font-semibold">ELIMINAR</span> para confirmar:
            </p>
            <input
              type="text"
              placeholder="ELIMINAR"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-center"
              onChange={(e) => {
                const deleteButton = document.getElementById('delete-confirm-button');
                if (deleteButton) {
                  deleteButton.disabled = e.target.value !== 'ELIMINAR';
                }
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            id="delete-confirm-button"
            onClick={handleDelete}
            disabled={loading || true}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <FaTrash className="h-4 w-4" />
                <span>Eliminar Evento</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
