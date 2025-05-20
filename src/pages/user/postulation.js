import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
  Divider,
  Avatar,
  LinearProgress,
  Alert,
  Snackbar,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Badge,
  IconButton,
  Skeleton, // Componente Skeleton añadido aquí
  styled
} from '@mui/material';
import {
  CalendarToday,
  People,
  Work,
  LocationOn,
  CheckCircle,
  ArrowBack,
  Share,
  Bookmark,
  VerifiedUser,
  Description,
  // Removemos Schedule ya que no se usa
  Star
} from '@mui/icons-material';
import API_URL from '../../config/apiConfig';
import { deepPurple, green, orange, blue } from '@mui/material/colors';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)'
}));

const ProjectHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2)
  }
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  backgroundColor: status === 'active' 
    ? green[50] 
    : status === 'completed' 
      ? '#f5f5f5' 
      : orange[50],
  color: status === 'active' 
    ? green[800] 
    : status === 'completed' 
      ? '#616161' 
      : orange[800],
  border: `1px solid ${status === 'active' 
    ? green[100] 
    : status === 'completed' 
      ? '#e0e0e0' 
      : orange[100]}`,
  alignSelf: 'flex-start'
}));

const Postulation = () => {  const { projectId } = useParams();  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  // No usamos userProfile directamente, así que lo eliminamos
  const [profileComplete, setProfileComplete] = useState(false);
  // No necesitamos showProfileAlert porque mostramos la alerta basada en profileComplete
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
      
      // Obtener los datos del perfil y verificar si está completo
      const fetchUserProfile = async () => {
        try {
          // Usamos directamente la API de validación de perfil 
          // en lugar de intentar obtener primero los datos del perfil
          const completionResponse = await axios.get(`${API_URL}/auth/profile-completion/${storedUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setProfileComplete(completionResponse.data.isComplete);
          
          if (!completionResponse.data.isComplete) {
            // Si el perfil no está completo, mostrar los campos faltantes
            setIncompleteFields(completionResponse.data.emptyFields || []);
          }
        } catch (err) {
          console.error('Error al verificar la completitud del perfil:', err);
          // En caso de error, asumimos que el perfil no está completo
          setProfileComplete(false);
        }
      };
      
      fetchUserProfile();
    }
  }, [navigate]);
  
  // Ya no necesitamos esta función, ya que la validación se hace en el backend
  // const validateProfileCompletion = (profile) => {
  //   if (!profile) return setProfileComplete(false);
  //   
  //   // Comprobar si los campos requeridos están completos
  //   const requiredFields = ['phone', 'dni', 'address'];
  //   const isComplete = requiredFields.every(field => 
  //     profile[field] && profile[field].toString().trim() !== ''
  //   );
  //   
  //   setProfileComplete(isComplete);
  // };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/projects/${projectId}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del proyecto');
        setLoading(false);
        showSnackbar('Error al cargar el proyecto', 'error');
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handlePostulation = async () => {
    try {
      await axios.post(`${API_URL}/postulations`, {
        projectId: project._id,
        userId: userId,
      });
      showSnackbar('¡Postulación exitosa!', 'success');
      // Actualizar el estado para mostrar que el usuario está postulado
      setProject(prev => ({ ...prev, isApplied: true }));
    } catch (err) {
      console.error('Error al realizar la postulación', err);
      const errorMessage = err.response?.data?.message || 'Error al realizar la postulación';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showSnackbar('Enlace copiado al portapapeles', 'info');
  };

  if (loading) {
    return (
      <StyledContainer maxWidth="lg">
        <LinearProgress sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="lg">
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
        >
          Volver a proyectos
        </Button>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Volver
        </Button>

        <ProjectHeader>
          <Box>
            <Typography variant="h3" component="h1" sx={{ 
              fontWeight: 700,
              color: 'primary.dark',
              mb: 1
            }}>
              {project.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={project.organization?.logo}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 1,
                    bgcolor: deepPurple[500]
                  }}
                >
                  {project.organization?.name?.charAt(0) || 'O'}
                </Avatar>
                <Typography variant="body1">
                  {project.organization?.name || 'Organización'}
                </Typography>
              </Box>
              <StatusChip 
                status={project.status || 'active'} 
                label={project.status === 'active' ? 'Activo' : 'Completado'} 
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleShare} color="primary">
              <Share />
            </IconButton>
            <IconButton color="primary">
              <Bookmark />
            </IconButton>
          </Box>
        </ProjectHeader>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={{ 
              borderRadius: 3,
              mb: 4,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              {project.bannerImage && (
                <CardMedia
                  component="img"
                  height="400"
                  image={project.bannerImage}
                  alt="Imagen del Proyecto"
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                />
              )}
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  Descripción del Proyecto
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.description}
                </Typography>

                {project.detailedDescription && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
                      Detalles Adicionales
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {project.detailedDescription}
                    </Typography>
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  Requisitos para Participar
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  {project.requirements?.split('\n').map((req, index) => (
                    <Typography component="li" variant="body1" key={index} paragraph>
                      {req}
                    </Typography>
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Beneficios para Voluntarios
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {['Certificación', 'Capacitación', 'Red profesional', 'Experiencia práctica'].map((benefit) => (
                    <Grid item xs={6} sm={3} key={benefit}>
                      <Paper elevation={0} sx={{ 
                        p: 2, 
                        height: '100%',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <CheckCircle color="primary" fontSize="small" />
                        <Typography variant="body2">{benefit}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ 
              borderRadius: 3,
              p: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Testimonios de Voluntarios
              </Typography>
              <Grid container spacing={3}>
                {[1, 2].map((item) => (
                  <Grid item xs={12} md={6} key={item}>
                    <Paper elevation={0} sx={{ 
                      p: 3, 
                      height: '100%',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            Voluntario {item}
                          </Typography>
                          <Box sx={{ display: 'flex' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} fontSize="small" color={star <= 4 ? 'primary' : 'disabled'} />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        "Mi experiencia en este proyecto fue increíble. Aprendí mucho y conocí personas maravillosas."
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ 
              borderRadius: 3,
              p: 3,
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 20
            }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Detalles del Proyecto
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Fecha de Inicio:</strong> {new Date(project.startDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Fecha de Fin:</strong> {new Date(project.endDate).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Voluntarios Requeridos:</strong> {project.volunteersRequired || 'No especificado'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Work color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Tipo de Proyecto:</strong> {project.projectType || 'No especificado'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Ubicación:</strong> {project.location || 'Remoto'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Proceso de Postulación
              </Typography>
              <Stepper orientation="vertical" sx={{ mb: 3 }}>
                <Step active>                  <StepLabel
                    error={!profileComplete}
                    StepIconProps={{
                      style: { 
                        color: profileComplete ? blue[500] : 'red' 
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      Completa tu perfil
                      {!profileComplete && (
                        <Button 
                          size="small" 
                          color="error"
                          variant="outlined"
                          onClick={() => navigate('/perfil')}
                          sx={{ ml: 2, fontSize: '0.7rem', py: 0.5 }}
                        >
                          {incompleteFields.length > 0 ? 'Completar datos' : 'Ir a perfil'}
                        </Button>
                      )}
                    </Box>
                  </StepLabel>
                </Step>
                <Step active={profileComplete}>
                  <StepLabel disabled={!profileComplete}>Envía tu solicitud</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Confirmación</StepLabel>
                </Step>
              </Stepper>              {!profileComplete && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Debes completar tu perfil antes de postularte. Por favor, verifica los siguientes campos:
                  </Typography>
                  {incompleteFields && incompleteFields.length > 0 ? (
                    <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                      {incompleteFields.map((field, index) => (
                        <Typography component="li" variant="body2" key={index}>
                          {field === 'phone' && 'Teléfono'}
                          {field === 'dni' && 'DNI/Documento de identidad'}
                          {field === 'address' && 'Dirección'}
                          {field === 'birthdate' && 'Fecha de nacimiento'}
                          {field === 'skills' && 'Habilidades'}
                          {field === 'education' && 'Educación'}
                        </Typography>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2">
                      Tu perfil está incompleto. Por favor dirígete a la sección de perfil para completarlo.
                    </Typography>
                  )}
                </Alert>
              )}<Button
                onClick={handlePostulation}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={project.isApplied || !profileComplete}
                startIcon={<VerifiedUser />}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  mt: 2
                }}
              >
                {project.isApplied 
                  ? 'Ya estás postulado' 
                  : !profileComplete 
                    ? 'Completa tu perfil para postular' 
                    : 'Postularme ahora'
                }
              </Button>

              {project.isApplied && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  ¡Gracias por postularte! Revisaremos tu solicitud pronto.
                </Alert>
              )}
            </Card>

            <Card elevation={0} sx={{ 
              borderRadius: 3,
              p: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                Sobre la Organización
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  src={project.organization?.logo}
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    mr: 2,
                    bgcolor: deepPurple[500]
                  }}
                >
                  {project.organization?.name?.charAt(0) || 'O'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {project.organization?.name || 'Organización'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.organization?.sector || 'Sector no especificado'}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" paragraph>
                {project.organization?.description || 'Descripción no disponible'}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
              >
                Ver más proyectos
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default Postulation;