import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  LinearProgress,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  VolunteerActivism, 
  Search, 
  AssignmentTurnedIn, 
  Group, 
  TrendingUp 
} from '@mui/icons-material';
import SearchBar from '../../components/SearchBar';
import PostulationsTable from '../../components/PostulationsTable';
import { styled } from '@mui/material/styles';
import API_URL from '../../config/apiConfig';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(6),
  background: 'linear-gradient(to bottom, #f9f9ff, #ffffff)',
  borderRadius: '16px',
  padding: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)'
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderRadius: '12px',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const Platform = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalApplications: 0,
    accepted: 0,
    pending: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedUserId = localStorage.getItem('userId');

    if (!token) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
      setUserId(storedUserId);

      // Obtener los datos de postulaciones del usuario desde la API
      fetchUserPostulations(storedUserId);
    }
  }, [navigate]);

  const fetchUserPostulations = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/postulations/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Calcular estadísticas basadas en los datos recibidos
      const postulations = response.data;
      
      // Contar las postulaciones según su estado
      const totalApplications = postulations.length;
      const accepted = postulations.filter(p => p.status === 'accepted').length;
      const pending = postulations.filter(p => p.status === 'pending').length;
      const rejected = postulations.filter(p => p.status === 'rejected').length;

      setStats({
        totalApplications,
        accepted,
        pending,
        rejected
      });
    } catch (err) {
      console.error('Error al obtener las postulaciones:', err);
      setError('No se pudieron cargar las estadísticas de postulaciones');
      
      // En caso de error, establecer valores por defecto
      setStats({
        totalApplications: 0,
        accepted: 0,
        pending: 0,
        rejected: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      {/* Header con bienvenida */}
      <Box textAlign="center" mb={6}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          margin: '0 auto 16px', 
          bgcolor: 'primary.main',
          fontSize: '2rem'
        }}>
          {username ? username.charAt(0).toUpperCase() : 'V'}
        </Avatar>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          color: 'primary.dark'
        }}>
          Bienvenido, {username}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" maxWidth="800px" margin="0 auto">
          Esta plataforma está diseñada para conectar tu pasión con oportunidades de voluntariado que generan impacto.
          Explora proyectos, gestiona tus postulaciones y únete a comunidades que comparten tus valores.
        </Typography>
      </Box>
        {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} mb={6}>
        {loading ? (
          <Grid item xs={12} textAlign="center" py={4}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Cargando estadísticas...
            </Typography>
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Box sx={{ 
              p: 3, 
              bgcolor: '#fff1f0', 
              borderRadius: 2, 
              color: '#cf1322',
              border: '1px solid #ffa39e'
            }}>
              <Typography variant="body1">{error}</Typography>
            </Box>
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <VolunteerActivism color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {stats.totalApplications}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Postulaciones realizadas
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <AssignmentTurnedIn color="success" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {stats.accepted}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Proyectos aceptados
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard>
                <Group color="warning" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Postulaciones pendientes
                </Typography>
              </FeatureCard>
            </Grid>
            <Grid item xs={12} md={3}>
              <FeatureCard sx={{ 
                bgcolor: stats.rejected > 0 ? '#fff2f0' : 'white',
                borderColor: stats.rejected > 0 ? '#ffccc7' : 'divider',
                borderWidth: 1,
                borderStyle: 'solid'
              }}>
                <Group color="error" sx={{ fontSize: 50, mb: 2, opacity: stats.rejected > 0 ? 1 : 0.5 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {stats.rejected}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Postulaciones rechazadas
                </Typography>
              </FeatureCard>
            </Grid>
          </>
        )}
      </Grid>

      {/* Barra de búsqueda */}
      <Box mb={6} position="relative">
        <Typography variant="h6" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Search color="primary" sx={{ mr: 1 }} /> Buscar en mis postulaciones
        </Typography>
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="Buscar proyectos por nombre..." 
        />
      </Box>

      {/* Tabla de postulaciones */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center'
        }}>
          <TrendingUp color="primary" sx={{ mr: 1 }} /> Historial de Postulaciones
        </Typography>
        <Box 
          bgcolor="background.paper" 
          boxShadow={3} 
          borderRadius={2} 
          p={3}
          sx={{
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <PostulationsTable searchTerm={searchTerm} />
        </Box>
      </Box>

      {/* Sección de recursos */}
      <Box mt={8}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Recursos para voluntarios
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Consejos para voluntarios
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Descubre cómo maximizar tu impacto como voluntario con nuestra guía de mejores prácticas.
              </Typography>
              <Chip 
                label="Ver guía" 
                color="primary" 
                variant="outlined" 
                clickable
                sx={{ mt: 2 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Próximos eventos
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Únete a nuestros webinars y eventos de capacitación para voluntarios.
              </Typography>
              <Chip 
                label="Ver calendario" 
                color="secondary" 
                variant="outlined" 
                clickable
                sx={{ mt: 2 }}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </StyledContainer>
  );
};

export default Platform;