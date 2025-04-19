import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  Box,
  CircularProgress,
  Divider,
  Chip,
  Paper,
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import {
  Edit,
  CameraAlt,
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  Star,
  Event,
  Person,
  Lock,
  Notifications,
  Payment,
  Security,
  Info,
  Palette,
  Language
} from '@mui/icons-material';
import API_URL from '../../config/apiConfig';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Datos de ejemplo para el diseño premium
        const enhancedUser = {
          ...response.data,
          stats: {
            projects: 12,
            hours: 256,
            rating: 4.8,
            badges: 5
          },
          socialLinks: {
            twitter: 'twitter.com/user',
            linkedin: 'linkedin.com/in/user',
            github: 'github.com/user'
          },
          preferences: {
            theme: 'Claro',
            language: 'Español',
            notifications: true
          }
        };
        
        setUser(enhancedUser);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el perfil del usuario');
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ 
        marginTop: '2rem', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" mt={3}>Cargando tu perfil premium...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" style={{ 
        marginTop: '2rem', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh'
      }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
      </Container>
    );
  }

  if (user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header del perfil */}
        <Paper elevation={3} sx={{ 
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
        }}>
          <Box sx={{ p: 4, display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt="Profile"
              src="https://randomuser.me/api/portraits/men/32.jpg"
              sx={{ 
                width: 120, 
                height: 120, 
                mr: 4,
                border: '4px solid white',
                boxShadow: theme.shadows[6]
              }}
            />
            <Box sx={{ flexGrow: 1, color: 'white' }}>
              <Typography variant="h3" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Work sx={{ mr: 1, fontSize: 20 }} /> 
                {user.role === 'volunteer' ? 'Voluntario Premium' : 'Administrador Senior'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Chip 
                  label={`⭐ ${user.stats.rating}`} 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
                <Chip 
                  label={`${user.stats.projects} proyectos`} 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
                <Chip 
                  label={`${user.stats.hours} horas`} 
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </Box>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Edit />}
              sx={{
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }
              }}
            >
              Editar Perfil
            </Button>
          </Box>
        </Paper>

        {/* Tabs de navegación */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab label="Información" icon={<Person />} />
          <Tab label="Seguridad" icon={<Lock />} />
          <Tab label="Notificaciones" icon={<Notifications />} />
          <Tab label="Preferencias" icon={<Palette />} />
        </Tabs>

        {activeTab === 0 && (
          <Grid container spacing={4}>
            {/* Columna izquierda - Información básica */}
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}>
                    <Info sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                    Información Personal
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Nombre Completo"
                      value={user.name}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
                      }}
                    />
                    <TextField
                      label="Email"
                      value={user.email}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />,
                      }}
                    />
                    <TextField
                      label="Teléfono"
                      value={user.phone || '+54 11 1234-5678'}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />,
                      }}
                    />
                    <TextField
                      label="Dirección"
                      value={user.address || 'Av. Siempreviva 742, Buenos Aires'}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        startAdornment: <LocationOn sx={{ color: 'action.active', mr: 1 }} />,
                      }}
                    />
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    startIcon={<Edit />}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Actualizar Información
                  </Button>
                </CardContent>
              </Card>

              {/* Tarjeta de redes sociales */}
              <Card elevation={3} sx={{ borderRadius: 3, mt: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}>
                    <Language sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                    Redes Sociales
                  </Typography>
                  
                  <TextField
                    label="Twitter"
                    value={user.socialLinks.twitter}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    label="LinkedIn"
                    value={user.socialLinks.linkedin}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    label="GitHub"
                    value={user.socialLinks.github}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                  />
                  
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    Conectar más redes
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Columna derecha - Estadísticas y más */}
            <Grid item xs={12} md={6}>
              {/* Tarjeta de estadísticas */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}>
                    <Star sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                    Estadísticas
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.light
                      }}>
                        <Typography variant="h4" fontWeight="bold">
                          {user.stats.projects}
                        </Typography>
                        <Typography variant="body2">Proyectos</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: theme.palette.secondary.light
                      }}>
                        <Typography variant="h4" fontWeight="bold">
                          {user.stats.hours}
                        </Typography>
                        <Typography variant="body2">Horas</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: theme.palette.success.light
                      }}>
                        <Typography variant="h4" fontWeight="bold">
                          {user.stats.rating}
                        </Typography>
                        <Typography variant="body2">Calificación</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: theme.palette.warning.light
                      }}>
                        <Typography variant="h4" fontWeight="bold">
                          {user.stats.badges}
                        </Typography>
                        <Typography variant="body2">Insignias</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Tarjeta de habilidades */}
              <Card elevation={3} sx={{ borderRadius: 3, mt: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}>
                    <School sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                    Habilidades
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {['Liderazgo', 'Trabajo en equipo', 'Comunicación', 'React', 'Node.js', 'Diseño UX'].map(skill => (
                      <Chip 
                        key={skill}
                        label={skill} 
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    ))}
                    <Button size="small" sx={{ ml: 1 }}>+ Añadir</Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Tarjeta de actividad reciente */}
              <Card elevation={3} sx={{ borderRadius: 3, mt: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}>
                    <Event sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                    Actividad Reciente
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    {[
                      { date: 'Hoy', activity: 'Completaste el proyecto "Ayuda Comunitaria"' },
                      { date: 'Ayer', activity: 'Ganaste la insignia "Voluntario Estrella"' },
                      { date: '15/06', activity: 'Actualizaste tu información de perfil' },
                      { date: '10/06', activity: 'Registraste 8 horas de voluntariado' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="caption" color="textSecondary">
                          {item.date}
                        </Typography>
                        <Typography variant="body1">
                          {item.activity}
                        </Typography>
                        {index < 3 && <Divider sx={{ mt: 1 }} />}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Lock sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                Seguridad y Privacidad
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Gestiona tu seguridad y configuración de privacidad.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Button variant="outlined" startIcon={<Security />} sx={{ mr: 2 }}>
                  Cambiar Contraseña
                </Button>
                <Button variant="outlined" startIcon={<Notifications />}>
                  Configurar 2FA
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Notifications sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                Configuración de Notificaciones
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Personaliza cómo y cuándo recibir notificaciones.
              </Typography>
              {/* Aquí iría el contenido de notificaciones */}
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Payment sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                Métodos de Pago
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Administra tus métodos de pago y suscripciones.
              </Typography>
              {/* Aquí iría el contenido de pagos */}
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Palette sx={{ mr: 1, color: theme.palette.primary.main }} /> 
                Preferencias
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Personaliza la apariencia y comportamiento de la aplicación.
              </Typography>
              {/* Aquí iría el contenido de preferencias */}
            </CardContent>
          </Card>
        )}
      </Container>
    );
  }

  return null;
};

export default Profile;