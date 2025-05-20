import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CircularProgress, Divider, Box, Button } from '@mui/material';
import API_URL from '../../config/apiConfig';
import PersonalInfoForm from '../../components/profile/PersonalInfoForm';
import ProfileImageUploader from '../../components/profile/ProfileImageUploader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTester, setShowTester] = useState(false);
  const [volunteerProfile, setVolunteerProfile] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Simplemente guardar la respuesta en el estado
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar el perfil:', err);
      setError('Error al cargar el perfil del usuario');
      setLoading(false);
    }
  };

  const fetchVolunteerProfile = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/volunteer-profiles/${userId || ''}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error('Error al obtener el perfil del voluntario:', err);
      throw new Error('Error al obtener el perfil del voluntario');
    }
  };
  const VolunteerProfileDetails = ({ profile }) => (
    <Card sx={{ marginTop: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ marginBottom: 2, color: '#2e7d32', fontWeight: 'bold' }}>
          Perfil de Voluntario
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Sección de la imagen */}
          <Box sx={{ flex: '0 0 auto', textAlign: 'center' }}>
            {profile.profileImage && profile.profileImage.url ? (
              <img 
                src={profile.profileImage.url} 
                alt={profile.profileImage.altText || 'Imagen de perfil'} 
                style={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '4px solid #e8f5e9',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }} 
              />
            ) : (
              <Box 
                sx={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  backgroundColor: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <Typography>Sin imagen</Typography>
              </Box>
            )}
            <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>
              {profile.user?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {profile.user?.email}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                display: 'inline-block', 
                backgroundColor: profile.status === 'regular' ? '#e8f5e9' : '#f5f5f5',
                color: profile.status === 'regular' ? '#2e7d32' : '#757575',
                borderRadius: '20px',
                padding: '4px 12px',
                mt: 1,
                fontWeight: 'medium'
              }}
            >
              {profile.status === 'regular' ? 'Voluntario Activo' : profile.status}
            </Typography>
          </Box>

          {/* Sección de estadísticas */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2
            }}>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', color: '#424242' }}>
                  Estadísticas
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Proyectos Totales</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.totalProjects}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Proyectos Completados</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.completedProjects}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Horas Totales</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.totalHours}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Horas Disponibles</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.availabilityHours}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', color: '#424242' }}>
                  Evaluaciones
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Confiabilidad</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.reliability}/5</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Puntualidad</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.punctuality}/5</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Calidad de Tareas</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.taskQuality}/5</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tasa de Éxito</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{profile.successRate}%</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2, bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem', color: '#424242' }}>
                Información Adicional
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>ID de Perfil</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{profile._id}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Última Actividad</Typography>
                  <Typography variant="body2">{new Date(profile.lastActive).toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Creado</Typography>
                  <Typography variant="body2">{new Date(profile.createdAt).toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Actualizado</Typography>
                  <Typography variant="body2">{new Date(profile.updatedAt).toLocaleString()}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const fetchAndSetVolunteerProfile = async () => {
    try {
      const profileData = await fetchVolunteerProfile();
      setVolunteerProfile(profileData);
    } catch (err) {
      setError('Error al cargar el perfil del voluntario');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchAndSetVolunteerProfile();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <CircularProgress />
        <Typography variant="h6">Cargando perfil...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }  // Renderizar los campos del usuario
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        borderRadius: '10px',
        padding: '30px 20px',
        color: 'white',
        textAlign: 'center',
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.15)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h20v20H0z" fill="%23ffffff" fill-opacity="0.05"/%3E%3C/svg%3E")',
            backgroundSize: '10px 10px',
            zIndex: 0
          }} 
        />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Tu Perfil
          </Typography>
          <Typography variant="subtitle1">
            Gestiona tu información personal y perfil de voluntario
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Columna izquierda - Perfil del usuario */}
        <Box sx={{ flex: 1 }}>
          {user && (
            <>
              <Card sx={{ borderRadius: '10px', mb: 3, overflow: 'hidden', boxShadow: 3 }}>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: '#f9f9f9', 
                  borderBottom: '1px solid #eeeeee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Información Personal
                  </Typography>
                  <Box 
                    sx={{ 
                      backgroundColor: user.role === 'volunteer' ? '#e8f5e9' : '#f5f5f5',
                      color: user.role === 'volunteer' ? '#2e7d32' : '#757575',
                      py: 0.5,
                      px: 2,
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'medium',
                      textTransform: 'capitalize'
                    }}
                  >
                    {user.role}
                  </Box>
                </Box>
                
                {/* Componente para editar información personal */}
                <PersonalInfoForm userData={user} onUpdateSuccess={fetchUserProfile} />
              </Card>
              
              {/* Componente para gestionar la imagen de perfil */}
              <ProfileImageUploader userData={user} onUpdateSuccess={fetchUserProfile} />
            </>
          )}
        </Box>
        
        {/* Columna derecha - Perfil del voluntario */}
        <Box sx={{ flex: 1 }}>
          {volunteerProfile && <VolunteerProfileDetails profile={volunteerProfile} />}
          
          {!volunteerProfile && (
            <Card sx={{ borderRadius: '10px', boxShadow: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 4, backgroundColor: '#f9f9f9' }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <img 
                  src="/src/assets/img/icon/voluntario.png" 
                  alt="Perfil de Voluntario" 
                  style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }}
                />
                <Typography variant="h6" sx={{ mb: 2, color: '#424242' }}>
                  No tienes un perfil de voluntario
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#757575' }}>
                  Crea tu perfil de voluntario para poder acceder a proyectos y oportunidades
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {/* Navegar a crear perfil */}}
                >
                  Crear Perfil de Voluntario
                </Button>
              </Box>
            </Card>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
