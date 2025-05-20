import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/apiConfig';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/volunteer-profiles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.exists === false) {
          setProfile(null);
          setError({
            type: 'no-profile',
            message: response.data.message,
            userId: response.data.userId
          });
        } else {
          setProfile(response.data);
          setError(null);
        }
      } catch (err) {
        setError({
          type: 'error',
          message: err.response?.data?.message || 'Error al cargar el perfil'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleCreateProfile = () => {
    navigate('/crear-perfil');
  };

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (error && error.type === 'no-profile') {
    return (
      <div className="profile-not-found">
        <h2>No tienes un perfil de voluntario</h2>
        <p>{error.message}</p>
        <button 
          className="btn btn-primary" 
          onClick={handleCreateProfile}
        >
          Crear mi perfil ahora
        </button>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!profile) {
    return <div>No se pudo cargar el perfil</div>;
  }

  return (
    <div className="profile-container">
      <h1>Mi Perfil de Voluntario</h1>
      <div className="profile-info">
        <div className="profile-image">
          {profile.profileImage && profile.profileImage.url ? (
            <img 
              src={profile.profileImage.url} 
              alt={profile.profileImage.altText || 'Imagen de perfil'} 
            />
          ) : (
            <div className="no-image">
              <p>Sin imagen de perfil</p>
              <button onClick={() => navigate('/actualizar-imagen')}>
                Agregar imagen
              </button>
            </div>
          )}
        </div>
        <div className="profile-details">
          <h2>{profile.user?.name}</h2>
          <p><strong>Email:</strong> {profile.user?.email}</p>
          <h3>Causas preferidas</h3>
          {profile.preferredCauses && profile.preferredCauses.length > 0 ? (
            <ul>
              {profile.preferredCauses.map((cause, index) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
          ) : (
            <p>No has especificado causas preferidas</p>
          )}
        </div>
      </div>
      <div className="profile-actions">
        <button onClick={() => navigate('/editar-perfil')}>
          Editar Perfil
        </button>
        <button onClick={() => navigate('/actualizar-imagen')}>
          Cambiar Imagen
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
