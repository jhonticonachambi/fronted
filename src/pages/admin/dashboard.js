//pages/admin/dashboard.js
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Paper,
  LinearProgress,
  Avatar,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import axios from 'axios';
import API_URL from '../../config/apiConfig';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    tasks: [],
    stats: {
      volunteers: 0,
      projects: 0,
      tasks: 0,
      completedTasks: 0,
      activeProjects: 0,
      highPriorityTasks: 0
    },
    loading: true,
    error: null
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, volunteersRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/users/count/volunteers`),
        axios.get(`${API_URL}/tasks`) // Obtenemos todas las tareas
      ]);

      const activeProjects = projectsRes.data.filter(p => p.status === 'activo').length;
      const completedTasks = tasksRes.data.filter(t => t.status === 'completed').length;
      const highPriorityTasks = tasksRes.data.filter(t => t.priority === 'high').length;

      setDashboardData({
        projects: projectsRes.data.slice(0, 5),
        tasks: tasksRes.data.slice(0, 5),
        stats: {
          volunteers: volunteersRes.data.count || 0,
          projects: projectsRes.data.length,
          tasks: tasksRes.data.length,
          completedTasks,
          activeProjects,
          highPriorityTasks
        },
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Error al cargar datos'
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Componente de tarjeta de estadísticas
  const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Avatar sx={{ bgcolor: `${color}.main` }}>
              {icon}
            </Avatar>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  // Componente para mostrar el estado de las tareas
  const TaskStatusPill = ({ status }) => {
    const statusConfig = {
      pending: { color: 'warning', label: 'Pendiente' },
      'in progress': { color: 'info', label: 'En progreso' },
      completed: { color: 'success', label: 'Completada' },
      archived: { color: 'default', label: 'Archivada' }
    };

    return (
      <Chip
        label={statusConfig[status]?.label || status}
        color={statusConfig[status]?.color || 'default'}
        size="small"
      />
    );
  };

  // Componente para mostrar la prioridad de las tareas
  const TaskPriorityPill = ({ priority }) => {
    const priorityConfig = {
      low: { color: 'success', label: 'Baja' },
      medium: { color: 'warning', label: 'Media' },
      high: { color: 'error', label: 'Alta' }
    };

    return (
      <Chip
        label={priorityConfig[priority]?.label || priority}
        color={priorityConfig[priority]?.color || 'default'}
        size="small"
      />
    );
  };

  if (dashboardData.loading) {
    return (
      <Box sx={{ width: '100%', p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (dashboardData.error) {
    return (
      <Container sx={{ p: 4 }}>
        <Alert severity="error">{dashboardData.error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Panel de Control
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Resumen completo de tu organización
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Voluntarios" 
            value={dashboardData.stats.volunteers}
            icon="V"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Proyectos" 
            value={dashboardData.stats.projects}
            subtitle={`${dashboardData.stats.activeProjects} activos`}
            icon="P"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Tareas" 
            value={dashboardData.stats.tasks}
            subtitle={`${dashboardData.stats.completedTasks} completadas`}
            icon="T"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Prioridad Alta" 
            value={dashboardData.stats.highPriorityTasks}
            icon="!"
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard 
            title="Participación" 
            value={`${Math.round((dashboardData.stats.completedTasks / dashboardData.stats.tasks) * 100 || 0)}%`}
            icon="%"
            color="success"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Proyectos Recientes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Proyectos Recientes</Typography>
                <Chip label={`Mostrando ${dashboardData.projects.length} de ${dashboardData.stats.projects}`} />
              </Box>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 1,
                  p: 2,
                  bgcolor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="subtitle2" fontWeight="bold">Nombre</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">Estado</Typography>
                </Box>
                {dashboardData.projects.map((project) => (
                  <Box key={project._id} sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: 1,
                    p: 2,
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover
                    }
                  }}>
                    <Typography variant="body1" fontWeight="medium">
                      {project.name}
                    </Typography>
                    <TaskStatusPill status={project.status} />
                  </Box>
                ))}
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Tareas Recientes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Tareas Recientes</Typography>
                <Chip label={`Mostrando ${dashboardData.tasks.length} de ${dashboardData.stats.tasks}`} />
              </Box>
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                  gap: 1,
                  p: 2,
                  bgcolor: theme.palette.grey[100],
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="subtitle2" fontWeight="bold">Título</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">Estado</Typography>
                  <Typography variant="subtitle2" fontWeight="bold">Prioridad</Typography>
                </Box>
                {dashboardData.tasks.map((task) => (
                  <Box key={task._id} sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                    gap: 1,
                    p: 2,
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover
                    }
                  }}>
                    <Typography variant="body1" fontWeight="medium">
                      {task.title}
                    </Typography>
                    <TaskStatusPill status={task.status} />
                    <TaskPriorityPill priority={task.priority} />
                  </Box>
                ))}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;