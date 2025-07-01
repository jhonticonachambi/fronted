// hooks/useVolunteerHistory.js
import { useState, useEffect } from 'react';
import { 
  addProjectToVolunteerHistory, 
  completeProjectInHistory, 
  getVolunteerHistory 
} from '../utils/volunteerHistoryAPI';

export const useVolunteerHistory = (volunteerId) => {
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (volunteerId) {
      fetchVolunteerHistory();
    }
  }, [volunteerId]);

  const fetchVolunteerHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVolunteerHistory(volunteerId);
      setVolunteerData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const assignToProject = async (projectId, additionalData = {}) => {
    try {
      const result = await addProjectToVolunteerHistory(volunteerId, projectId, additionalData);
      // Actualizar datos locales
      await fetchVolunteerHistory();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const completeProject = async (projectId) => {
    try {
      const result = await completeProjectInHistory(volunteerId, projectId);
      // Actualizar datos locales
      await fetchVolunteerHistory();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const isAssignedToProject = (projectId) => {
    return volunteerData?.projectHistory?.some(
      project => project.project._id === projectId || project.project === projectId
    ) || false;
  };

  const getProjectStatus = (projectId) => {
    const project = volunteerData?.projectHistory?.find(
      p => p.project._id === projectId || p.project === projectId
    );
    return project ? (project.completed ? 'completed' : 'active') : 'not_assigned';
  };

  return {
    volunteerData,
    loading,
    error,
    assignToProject,
    completeProject,
    isAssignedToProject,
    getProjectStatus,
    refetch: fetchVolunteerHistory
  };
};
