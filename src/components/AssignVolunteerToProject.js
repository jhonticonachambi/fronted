// components/AssignVolunteerToProject.js
import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaCheck, FaSpinner } from 'react-icons/fa';
import { addProjectToVolunteerHistory, getVolunteerHistory } from '../utils/volunteerHistoryAPI';

const AssignVolunteerToProject = ({ volunteerId, projectId, projectName, volunteerName, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkIfAlreadyAssigned();
  }, [volunteerId, projectId]);

  const checkIfAlreadyAssigned = async () => {
    try {
      const volunteerData = await getVolunteerHistory(volunteerId);
      const isAssigned = volunteerData.projectHistory?.some(
        project => project.project._id === projectId
      );
      setAssigned(isAssigned);
    } catch (err) {
      console.error('Error verificando asignación:', err);
    }
  };

  const handleAssignVolunteer = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await addProjectToVolunteerHistory(volunteerId, projectId, {
        role: 'Voluntario',
        startDate: new Date(),
        completed: false
      });

      setAssigned(true);
      onSuccess && onSuccess(result);
      
      // Mostrar notificación de éxito
      alert(`✅ ${volunteerName} ha sido asignado al proyecto "${projectName}" exitosamente!`);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al asignar voluntario';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (assigned) {
    return (
      <div className="flex items-center text-green-600 text-sm">
        <FaCheck className="mr-2" />
        <span>Ya asignado</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <button
        onClick={handleAssignVolunteer}
        disabled={loading}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-3 py-2 rounded transition-colors text-sm"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Asignando...</span>
          </>
        ) : (
          <>
            <FaUserPlus />
            <span>Asignar al Proyecto</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AssignVolunteerToProject;
