// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Container, Typography, Card, CardContent, CircularProgress, Box, Button } from '@mui/material';
// import API_URL from '../../config/apiConfig';
// import PersonalInfoForm from '../../components/profile/PersonalInfoForm';
// import ProfileImageUploader from '../../components/profile/ProfileImageUploader';
// import ProfileStats from '../../components/profile/ProfileStats';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [volunteerProfile, setVolunteerProfile] = useState(null);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_URL}/users/profile`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUser(response.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error al cargar el perfil:', err);
//       setError('Error al cargar el perfil del usuario');
//       setLoading(false);
//     }
//   };

//   const fetchVolunteerProfile = async (userId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.log('No se encontró token para la petición del perfil de voluntario');
//         return null;
//       }

//       console.log(`Solicitando perfil de voluntario desde: ${API_URL}/users/profile/${userId || ''}`);
      
//       const response = await axios.get(`${API_URL}/users/profile/${userId || ''}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       console.log('Respuesta del perfil de voluntario:', response.status);
//       return response.data;
//     } catch (err) {
//       console.error('Error al obtener el perfil del voluntario:', err);
//       console.error('Detalles del error:', err.response?.data || 'No hay detalles disponibles');
//       console.error('Estado HTTP:', err.response?.status);
      
//       if (err.response?.status === 404) {
//         console.log('El usuario no tiene perfil de voluntario');
//         return null;
//       }
      
//       throw new Error(`Error al obtener el perfil del voluntario: ${err.message}`);
//     }
//   };

//   const VolunteerProfileDetails = ({ profile }) => (
//     <Card>
//       <CardContent>
//         <Typography variant="h5">
//           Perfil de Voluntario
//         </Typography>
        
//         <Box>
//           {/* Sección de la imagen */}
//           <Box>
//             {profile.profileImage && profile.profileImage.url ? (
//               <img 
//                 src={profile.profileImage.url} 
//                 alt={profile.profileImage.altText || 'Imagen de perfil'} 
//               />
//             ) : (
//               <Box>
//                 <Typography>Sin imagen</Typography>
//               </Box>
//             )}
//             <Typography variant="subtitle1">
//               {profile.user?.name}
//             </Typography>
//             <Typography variant="body2">
//               {profile.user?.email}
//             </Typography>
//             <Typography variant="body2">
//               {profile.status === 'regular' ? 'Voluntario Activo' : profile.status}
//             </Typography>
//           </Box>

//           {/* Componente de estadísticas */}
//           <ProfileStats profile={profile} />
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   const fetchAndSetVolunteerProfile = async () => {
//     try {
//       const profileData = await fetchVolunteerProfile();
//       setVolunteerProfile(profileData);
//     } catch (err) {
//       console.error('Error al cargar el perfil del voluntario:', err);
//       setVolunteerProfile(null);
//     }
//   };

//   // Efectos para cargar los datos
//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   useEffect(() => {
//     if (!error) {
//       fetchAndSetVolunteerProfile();
//     }
//   }, [error]);

//   if (loading) {
//     return (
//       <Container>
//         <CircularProgress />
//         <Typography variant="h6">Cargando perfil...</Typography>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container>
//         <Typography variant="h6" color="error">{error}</Typography>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <Box>
//         <Typography variant="h3">
//           Tu Perfil
//         </Typography>
//         <Typography variant="subtitle1">
//           Gestiona tu información personal y perfil de voluntario
//         </Typography>
//       </Box>

//       <Box>
//         {/* Columna izquierda - Perfil del usuario */}
//         <Box>
//           {user && (
//             <>
//               <Card>
//                 <Box>
//                   <Typography variant="h5">
//                     Información Personal
//                   </Typography>
//                   <Box>
//                     {user.role}
//                   </Box>
//                 </Box>
                
//                 <PersonalInfoForm userData={user} onUpdateSuccess={fetchUserProfile} />
//               </Card>
              
//               <ProfileImageUploader userData={user} onUpdateSuccess={fetchUserProfile} />
//             </>
//           )}
//         </Box>
        
//         {/* Columna derecha - Perfil del voluntario */}
//         <Box>
//           {volunteerProfile && <VolunteerProfileDetails profile={volunteerProfile} />}
          
//           {!volunteerProfile && (
//             <Card>
//               <Box>
//                 <img 
//                   src="/src/assets/img/icon/voluntario.png" 
//                   alt="Perfil de Voluntario" 
//                 />
//                 <Typography variant="h6">
//                   No tienes un perfil de voluntario
//                 </Typography>
//                 <Typography variant="body2">
//                   Crea tu perfil de voluntario para poder acceder a proyectos y oportunidades
//                 </Typography>
//                 <Button 
//                   variant="contained" 
//                   color="primary"
//                   onClick={() => {/* Navegar a crear perfil */}}
//                 >
//                   Crear Perfil de Voluntario
//                 </Button>
//               </Box>
//             </Card>
//           )}
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default Profile;











import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Box, 
  Button, 
  Grid,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  VolunteerActivism as VolunteerIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  DoneAll as DoneIcon
} from '@mui/icons-material';
import API_URL from '../../config/apiConfig';
import PersonalInfoForm from '../../components/profile/PersonalInfoForm';
import ProfileStats from '../../components/profile/ProfileStats';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volunteerProfile, setVolunteerProfile] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      if (!token) return null;

      const response = await axios.get(`${API_URL}/users/profile/${userId || ''}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      throw new Error(`Error al obtener el perfil del voluntario: ${err.message}`);
    }
  };

  const fetchAndSetVolunteerProfile = async () => {
    try {
      const profileData = await fetchVolunteerProfile();
      setVolunteerProfile(profileData);
    } catch (err) {
      console.error('Error al cargar el perfil del voluntario:', err);
      setVolunteerProfile(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!error) {
      fetchAndSetVolunteerProfile();
    }
  }, [error]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" mt={2}>Cargando tu perfil...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box textAlign="center">
          <ErrorIcon color="error" style={{ fontSize: 60 }} />
          <Typography variant="h5" color="error" mt={2}>{error}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchUserProfile}
            sx={{ mt: 2 }}
          >
            Reintentar
          </Button>
        </Box>
      </Box>
    );
  }

  const VolunteerStatusBadge = ({ status }) => {
    const getStatusInfo = () => {
      switch (status) {
        case 'active':
          return { color: 'success', text: 'Activo', icon: <CheckCircleIcon /> };
        case 'inactive':
          return { color: 'warning', text: 'Inactivo', icon: <ErrorIcon /> };
        default:
          return { color: 'info', text: 'Regular', icon: <VolunteerIcon /> };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.text}
        color={statusInfo.color}
        variant="outlined"
        sx={{ 
          borderRadius: 1,
          fontWeight: 'bold',
          px: 1
        }}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Administra tu información personal y perfil de voluntario
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Columna izquierda - Información personal */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                  <PersonIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Información Personal
                </Typography>
                <Chip 
                  label={user?.role.toUpperCase()} 
                  color="secondary" 
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={user?.profileImage?.url}
                  alt={user?.profileImage?.altText || 'Foto de perfil'}
                  sx={{ width: 80, height: 80, mr: 3 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    {user?.name}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <EmailIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <PersonalInfoForm userData={user} onUpdateSuccess={fetchUserProfile} />
            </CardContent>
          </Card>
        </Grid>

        {/* Columna derecha - Perfil de voluntario */}
        <Grid item xs={12} md={6}>
          {volunteerProfile ? (
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight="bold">
                    <VolunteerIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Perfil de Voluntario
                  </Typography>
                  <VolunteerStatusBadge status={volunteerProfile?.status} />
                </Box>

                <Box mb={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <WorkIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Habilidades:</Typography>
                      </Box>
                      <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                        {volunteerProfile.skills?.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box display="flex" alignItems="center">
                        <StarIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Especialidades:</Typography>
                      </Box>
                      <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                        {volunteerProfile.specializations?.map((spec, index) => (
                          <Chip 
                            key={index} 
                            label={spec} 
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* <ProfileStats profile={volunteerProfile} /> */}
              </CardContent>
            </Card>
          ) : (
            <Card elevation={3} sx={{ 
              borderRadius: 3,
              textAlign: 'center',
              py: 6,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
            }}>
              <Box maxWidth={400} mx="auto">
                <VolunteerIcon color="primary" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  ¡Conviértete en Voluntario!
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={3}>
                  Crea tu perfil de voluntario para acceder a proyectos emocionantes y oportunidades de impacto social.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    boxShadow: 2
                  }}
                >
                  Crear Perfil de Voluntario
                </Button>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;