import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Box,
  Alert,
  IconButton
} from '@mui/material';
import { 
  FaUser, 
  FaEdit, 
  FaChartLine, 
  FaCheckCircle, 
  FaTrophy,
  FaClock,
  FaRocket
} from 'react-icons/fa';

const VolunteerMetrics = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  // Métricas editables
  const [metrics, setMetrics] = useState({
    reliability: 0,
    punctuality: 0,
    taskQuality: 0,
    successRate: 0,
    completedProjects: 0,
    totalProjects: 0
  });

  // Simular datos de voluntarios (reemplaza con API real)
  const mockVolunteers = [
    {
      id: '68387bf2ff42e352f440a013',
      name: 'Jhon Ticona Chambi',
      email: 'jhoticonac@upt.pe',
      reliability: 8.5,
      punctuality: 9.0,
      taskQuality: 8.7,
      successRate: 0.8125,
      completedProjects: 13,
      totalProjects: 16,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrfqqNGW1yUTzEtl3OsyaP_X9zHGaLVI_S9A&s'
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@ejemplo.com',
      reliability: 7.2,
      punctuality: 8.5,
      taskQuality: 7.8,
      successRate: 0.75,
      completedProjects: 9,
      totalProjects: 12,
      avatar: null
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos@ejemplo.com',
      reliability: 9.1,
      punctuality: 8.8,
      taskQuality: 9.2,
      successRate: 0.91,
      completedProjects: 20,
      totalProjects: 22,
      avatar: null
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setVolunteers(mockVolunteers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEditClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setMetrics({
      reliability: volunteer.reliability,
      punctuality: volunteer.punctuality,
      taskQuality: volunteer.taskQuality,
      successRate: volunteer.successRate,
      completedProjects: volunteer.completedProjects,
      totalProjects: volunteer.totalProjects
    });
    setEditDialogOpen(true);
  };

  const handleSaveMetrics = async () => {
    try {
      // Aquí harías la llamada a tu API
      // const response = await updateVolunteerMetrics(selectedVolunteer.id, metrics);
      
      // Por ahora, simulamos la actualización
      setVolunteers(prevVolunteers => 
        prevVolunteers.map(vol => 
          vol.id === selectedVolunteer.id 
            ? { ...vol, ...metrics }
            : vol
        )
      );

      setAlert({
        show: true,
        message: `Métricas de ${selectedVolunteer.name} actualizadas exitosamente`,
        severity: 'success'
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Error al actualizar las métricas',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (value, isPercentage = false) => {
    const threshold = isPercentage ? 0.8 : 8.0;
    if (value >= threshold) return 'success';
    if (value >= (isPercentage ? 0.6 : 6.0)) return 'warning';
    return 'error';
  };

  const MetricCard = ({ icon, title, value, isPercentage = false, color = 'primary' }) => (
    <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ mr: 2, color: `${color}.main` }}>
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {isPercentage ? `${(value * 100).toFixed(1)}%` : value.toFixed(1)}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={isPercentage ? value * 100 : (value / 10) * 100} 
            color={getStatusColor(value, isPercentage)}
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Métricas de Voluntarios</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Métricas de Voluntarios
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Gestiona y actualiza las métricas de rendimiento de los voluntarios para mejorar las recomendaciones de IA.
      </Typography>

      {alert.show && (
        <Alert 
          severity={alert.severity} 
          onClose={() => setAlert({ ...alert, show: false })}
          sx={{ mb: 3 }}
        >
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {volunteers.map((volunteer) => (
          <Grid item xs={12} key={volunteer.id}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={volunteer.avatar} 
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    <FaUser />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {volunteer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {volunteer.email}
                    </Typography>
                    <Chip 
                      label={`${volunteer.completedProjects}/${volunteer.totalProjects} proyectos`}
                      color={getStatusColor(volunteer.successRate, true)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<FaEdit />}
                  onClick={() => handleEditClick(volunteer)}
                  sx={{ minWidth: 120 }}
                >
                  Editar Métricas
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    icon={<FaCheckCircle size={24} />}
                    title="Confiabilidad"
                    value={volunteer.reliability}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    icon={<FaClock size={24} />}
                    title="Puntualidad"
                    value={volunteer.punctuality}
                    color="info"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    icon={<FaRocket size={24} />}
                    title="Calidad de Tareas"
                    value={volunteer.taskQuality}
                    color="warning"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    icon={<FaTrophy size={24} />}
                    title="Tasa de Éxito"
                    value={volunteer.successRate}
                    isPercentage={true}
                    color="secondary"
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog para editar métricas */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Editar Métricas - {selectedVolunteer?.name}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confiabilidad (0-10)"
                type="number"
                value={metrics.reliability}
                onChange={(e) => setMetrics({...metrics, reliability: parseFloat(e.target.value)})}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Puntualidad (0-10)"
                type="number"
                value={metrics.punctuality}
                onChange={(e) => setMetrics({...metrics, punctuality: parseFloat(e.target.value)})}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Calidad de Tareas (0-10)"
                type="number"
                value={metrics.taskQuality}
                onChange={(e) => setMetrics({...metrics, taskQuality: parseFloat(e.target.value)})}
                inputProps={{ min: 0, max: 10, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tasa de Éxito (0-1)"
                type="number"
                value={metrics.successRate}
                onChange={(e) => setMetrics({...metrics, successRate: parseFloat(e.target.value)})}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Proyectos Completados"
                type="number"
                value={metrics.completedProjects}
                onChange={(e) => setMetrics({...metrics, completedProjects: parseInt(e.target.value)})}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total de Proyectos"
                type="number"
                value={metrics.totalProjects}
                onChange={(e) => setMetrics({...metrics, totalProjects: parseInt(e.target.value)})}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveMetrics} variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VolunteerMetrics;
