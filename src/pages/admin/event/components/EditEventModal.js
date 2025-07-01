import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaSave } from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../../../../config/apiConfig';

const EditEventModal = ({ event, onClose, onEventUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    capacity: '',
    eventType: 'community',
    bannerImage: '',
    requirements: '',
    tags: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const eventTypes = [
    { value: 'workshop', label: 'Taller' },
    { value: 'conference', label: 'Conferencia' },
    { value: 'community', label: 'Comunitario' },
    { value: 'training', label: 'Capacitación' },
    { value: 'fundraising', label: 'Recaudación de fondos' },
    { value: 'volunteer', label: 'Voluntariado' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'completed', label: 'Completado' }
  ];

  useEffect(() => {
    if (event) {
      // Formatear la fecha para el input datetime-local
      const eventDate = new Date(event.eventDate);
      const formattedDate = eventDate.toISOString().slice(0, 16);

      setFormData({
        title: event.title || '',
        description: event.description || '',
        eventDate: formattedDate,
        location: event.location || '',
        capacity: event.capacity?.toString() || '',
        eventType: event.eventType || 'community',
        bannerImage: event.bannerImage || '',
        requirements: event.requirements || '',
        tags: event.tags?.join(', ') || '',
        status: event.status || 'active'
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'La fecha es requerida';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0';
    }

    // Verificar si la nueva capacidad es menor al número de asistentes actuales
    if (event.attendees && formData.capacity < event.attendees.length) {
      newErrors.capacity = `La capacidad no puede ser menor a ${event.attendees.length} (asistentes actuales)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      await axios.put(`${API_URL}/events/${event._id}`, eventData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      onEventUpdated();
    } catch (error) {
      console.error('Error updating event:', error);
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.path] = err.msg;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'Error al actualizar el evento. Inténtalo de nuevo.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600" />
            Editar Evento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Evento *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingresa el título del evento"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe el evento"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Fecha y Hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora *
              </label>
              <input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.eventDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>}
            </div>

            {/* Tipo de Evento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Evento *
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación *
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Dirección del evento"
                />
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Capacidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad Máxima *
              </label>
              <div className="relative">
                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min={event.attendees?.length || 1}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Número de asistentes"
                />
              </div>
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
              {event.attendees?.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Asistentes actuales: {event.attendees.length}
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado del Evento
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Banner Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Imagen del Banner (opcional)
              </label>
              <input
                type="url"
                name="bannerImage"
                value={formData.bannerImage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            {/* Requisitos */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requisitos (opcional)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Requisitos especiales para el evento"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiquetas (opcional)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="voluntariado, comunidad, educación (separadas por comas)"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <FaSave className="h-4 w-4" />
                  <span>Actualizar Evento</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
