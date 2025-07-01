// utils/volunteerHistoryAPI.js
import axios from 'axios';
import API_URL from '../config/apiConfig';

/**
 * Agregar un proyecto al historial de un voluntario
 * @param {string} userId - ID del voluntario
 * @param {string} projectId - ID del proyecto
 * @param {object} additionalData - Datos adicionales del proyecto (opcional)
 * @returns {Promise} - Respuesta de la API
 */
export const addProjectToVolunteerHistory = async (userId, projectId, additionalData = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_URL}/volunteer-profiles/${userId}/projects/${projectId}`,
      additionalData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error al agregar proyecto al historial:', error);
    throw error;
  }
};

/**
 * Completar un proyecto en el historial de un voluntario
 * @param {string} userId - ID del voluntario
 * @param {string} projectId - ID del proyecto
 * @returns {Promise} - Respuesta de la API
 */
export const completeProjectInHistory = async (userId, projectId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.put(
      `${API_URL}/volunteer-profiles/${userId}/projects/${projectId}/complete`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error al completar proyecto:', error);
    throw error;
  }
};

/**
 * Obtener historial de proyectos de un voluntario
 * @param {string} userId - ID del voluntario
 * @returns {Promise} - Respuesta de la API
 */
export const getVolunteerHistory = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_URL}/volunteer-profiles/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial:', error);
    throw error;
  }
};
