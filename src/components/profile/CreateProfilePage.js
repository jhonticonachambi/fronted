import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/apiConfig';

const CreateProfilePage = () => {
  const [formData, setFormData] = useState({
    preferredCauses: [],
    locationPreferences: [],
    availabilityHours: 0,
    socialMedia: {
      twitter: '',
      linkedin: '',
      github: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCausesChange = (e) => {
    const causes = e.target.value.split(',').map(cause => cause.trim());
    setFormData({
      ...formData,
      preferredCauses: causes.filter(cause => cause !== '')
    });
  };

  const handleLocationsChange = (e) => {
    const locations = e.target.value.split(',').map(location => location.trim());
    setFormData({
      ...formData,
      locationPreferences: locations.filter(location => location !== '')
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/volunteer-profiles`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/perfil');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-profile-container">
      <h1>Crear Perfil de Voluntario</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Causas preferidas (separadas por comas)</label>
          <input
            type="text"
            onChange={handleCausesChange}
            placeholder="Ej: Educación, Medio ambiente, Derechos humanos"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Ubicaciones preferidas (separadas por comas)</label>
          <input
            type="text"
            onChange={handleLocationsChange}
            placeholder="Ej: Madrid, Barcelona, Valencia"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Horas disponibles por semana</label>
          <input
            type="number"
            name="availabilityHours"
            value={formData.availabilityHours}
            onChange={handleChange}
            min="0"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Twitter</label>
          <input
            type="text"
            name="socialMedia.twitter"
            value={formData.socialMedia.twitter}
            onChange={handleChange}
            placeholder="@usuario"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="text"
            name="socialMedia.linkedin"
            value={formData.socialMedia.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/usuario"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>GitHub</label>
          <input
            type="text"
            name="socialMedia.github"
            value={formData.socialMedia.github}
            onChange={handleChange}
            placeholder="https://github.com/usuario"
            className="form-control"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Perfil'}
        </button>
      </form>
    </div>
  );
};

export default CreateProfilePage;
