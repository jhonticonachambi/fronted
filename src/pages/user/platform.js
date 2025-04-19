import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider
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
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalApplications: 0,
    accepted: 0,
    pending: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!token) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
      // Simular carga de estadísticas (en una app real, esto vendría de una API)
      setStats({
        totalApplications: 12,
        accepted: 5,
        pending: 3
      });
    }
  }, [navigate]);

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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
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