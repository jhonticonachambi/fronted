import React from 'react';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaTag, FaUser, FaImage } from 'react-icons/fa';

const ViewEventModal = ({ event, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  const getEventTypeText = (type) => {
    const types = {
      'workshop': 'Taller',
      'conference': 'Conferencia',
      'community': 'Comunitario',
      'training': 'Capacitación',
      'fundraising': 'Recaudación de fondos',
      'volunteer': 'Voluntariado'
    };
    return types[type] || type;
  };

  const isEventPast = new Date(event.eventDate) < new Date();
  const attendeeCount = event.attendees?.length || 0;
  const capacityPercentage = (attendeeCount / event.capacity) * 100;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Detalles del Evento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-6">
          {/* Banner Image */}
          {event.bannerImage && (
            <div className="w-full">
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Title and Status */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(event.status)}`}>
                  {getStatusText(event.status)}
                </span>
                <span className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {getEventTypeText(event.eventType)}
                </span>
              </div>
              {isEventPast && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-md text-sm">
                  <FaClock className="inline mr-1" />
                  Este evento ya ha finalizado
                </div>
              )}
            </div>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha y Hora */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Fecha y Hora</h3>
              </div>
              <p className="text-gray-700">{formatDate(event.eventDate)}</p>
            </div>

            {/* Ubicación */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-red-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Ubicación</h3>
              </div>
              <p className="text-gray-700">{event.location}</p>
            </div>

            {/* Capacidad */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaUsers className="text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Capacidad</h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  {attendeeCount} / {event.capacity} asistentes
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      capacityPercentage >= 90 ? 'bg-red-500' :
                      capacityPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round(capacityPercentage)}% de capacidad
                </p>
              </div>
            </div>

            {/* Organizador */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaUser className="text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Organizador</h3>
              </div>
              <p className="text-gray-700">
                {event.organizer?.name || 'No especificado'}
              </p>
              {event.organizer?.email && (
                <p className="text-sm text-gray-500">{event.organizer.email}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Requisitos */}
          {event.requirements && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Requisitos</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{event.requirements}</p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaTag className="text-yellow-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Etiquetas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Asistentes */}
          {attendeeCount > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Asistentes Registrados ({attendeeCount})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {event.attendees?.map((attendee, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {attendee.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">
                      {attendee.name || 'Usuario'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fechas de creación y actualización */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Creado: {new Date(event.createdAt).toLocaleString('es-ES')}</p>
            {event.updatedAt !== event.createdAt && (
              <p>Última actualización: {new Date(event.updatedAt).toLocaleString('es-ES')}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
