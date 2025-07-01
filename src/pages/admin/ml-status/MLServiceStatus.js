import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Alert,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  FaServer,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaRobot,
  FaDatabase,
  FaNetworkWired,
  FaChartLine,
  FaSync,
  FaCog
} from 'react-icons/fa';

const MLServiceStatus = () => {
  const [serviceStatus, setServiceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(new Date());
  const [retraining, setRetraining] = useState(false);

  // Simular estado del servicio (reemplaza con API real)
  const mockServiceStatus = {
    service: 'Volunteer ML Service',
    status: 'active',
    timestamp: new Date().toISOString(),
    details: {
      model_loaded: true,
      api_healthy: true,
      database_connected: true,
      predictions_count: 1247,
      model_accuracy: 0.89,
      last_training: '2025-06-29T10:30:00Z',
      uptime_hours: 72.5
    }
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const checkServiceStatus = async () => {
    setLoading(true);
    try {
      // Aquí harías la llamada real a tu API
      // const response = await fetch('/api/volunteer/ml/status');
      // const data = await response.json();
      
      // Por ahora, simulamos la respuesta
      setTimeout(() => {
        setServiceStatus(mockServiceStatus);
        setLastChecked(new Date());
        setLoading(false);
      }, 1000);
    } catch (error) {
      setServiceStatus({
        service: 'Volunteer ML Service',
        status: 'error',
        message: 'Error al conectar con el servicio ML'
      });
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      // Aquí harías la llamada real para re-entrenar
      // const response = await fetch('/api/volunteer/ml/retrain', { method: 'POST' });
      
      // Simular re-entrenamiento
      setTimeout(() => {
        setServiceStatus(prev => ({
          ...prev,
          details: {
            ...prev.details,
            last_training: new Date().toISOString(),
            model_accuracy: Math.min(0.95, prev.details.model_accuracy + 0.02)
          }
        }));
        setRetraining(false);
      }, 3000);
    } catch (error) {
      setRetraining(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaCheckCircle color="green" />;
      case 'warning': return <FaExclamationTriangle color="orange" />;
      case 'error': return <FaTimesCircle color="red" />;
      default: return <FaServer />;
    }
  };

  const StatusCard = ({ title, value, icon, status = 'success', subtitle = '' }) => (
    <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ mr: 2, color: `${status}.main` }}>
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Estado del Servicio ML</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🖥️ Estado del Servicio ML
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitoreo en tiempo real del servicio de Machine Learning para recomendaciones de voluntarios.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<FaSync />}
          onClick={checkServiceStatus}
          disabled={loading}
        >
          Actualizar Estado
        </Button>
      </Box>

      {/* Estado general del servicio */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 2, fontSize: '2rem' }}>
              {getStatusIcon(serviceStatus?.status)}
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {serviceStatus?.service || 'Servicio ML'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Última verificación: {lastChecked.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={serviceStatus?.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
            color={getStatusColor(serviceStatus?.status)}
            size="large"
            sx={{ px: 2, py: 1, fontSize: '1rem' }}
          />
        </Box>
      </Card>

      {serviceStatus?.status === 'active' && serviceStatus?.details ? (
        <>
          {/* Métricas del servicio */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard
                title="Tiempo Activo"
                value={`${serviceStatus.details.uptime_hours.toFixed(1)}h`}
                icon={<FaServer size={24} />}
                status="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard
                title="Predicciones Realizadas"
                value={serviceStatus.details.predictions_count.toLocaleString()}
                icon={<FaChartLine size={24} />}
                status="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard
                title="Precisión del Modelo"
                value={`${(serviceStatus.details.model_accuracy * 100).toFixed(1)}%`}
                icon={<FaRobot size={24} />}
                status="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatusCard
                title="Último Entrenamiento"
                value={new Date(serviceStatus.details.last_training).toLocaleDateString()}
                icon={<FaCog size={24} />}
                status="secondary"
                subtitle={new Date(serviceStatus.details.last_training).toLocaleTimeString()}
              />
            </Grid>
          </Grid>

          {/* Estado de componentes */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Estado de Componentes
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      {serviceStatus.details.model_loaded ? 
                        <FaCheckCircle color="green" /> : 
                        <FaTimesCircle color="red" />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary="Modelo ML Cargado"
                      secondary={serviceStatus.details.model_loaded ? "Funcionando correctamente" : "Error al cargar"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {serviceStatus.details.api_healthy ? 
                        <FaCheckCircle color="green" /> : 
                        <FaTimesCircle color="red" />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary="API de Predicción"
                      secondary={serviceStatus.details.api_healthy ? "Respondiendo correctamente" : "No responde"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {serviceStatus.details.database_connected ? 
                        <FaCheckCircle color="green" /> : 
                        <FaTimesCircle color="red" />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary="Conexión a Base de Datos"
                      secondary={serviceStatus.details.database_connected ? "Conectado" : "Desconectado"}
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Acciones de Mantenimiento
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<FaRobot />}
                    onClick={handleRetrain}
                    disabled={retraining}
                    color="secondary"
                    fullWidth
                  >
                    {retraining ? 'Re-entrenando Modelo...' : 'Re-entrenar Modelo ML'}
                  </Button>
                  
                  {retraining && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Re-entrenando modelo con nuevos datos...
                      </Typography>
                      <LinearProgress />
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    startIcon={<FaSync />}
                    onClick={checkServiceStatus}
                    fullWidth
                  >
                    Verificar Estado
                  </Button>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    El re-entrenamiento del modelo puede tomar varios minutos. 
                    Se recomienda hacerlo cuando haya nuevos datos de voluntarios disponibles.
                  </Alert>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="error" sx={{ mt: 3 }}>
          <Typography variant="h6">Servicio No Disponible</Typography>
          <Typography>
            {serviceStatus?.message || 'El servicio de Machine Learning no está respondiendo. Verifique que el servicio esté ejecutándose correctamente.'}
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default MLServiceStatus;
