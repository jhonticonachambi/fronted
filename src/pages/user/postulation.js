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
} from '@mui/material';
import API_URL from '../../config/apiConfig'; // Asegúrate de que esta ruta apunte correctamente a tu archivo de configuración

const Postulation = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects/${projectId}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del proyecto');
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handlePostulation = async () => {
    try {
      await axios.post(`${API_URL}/postulaciones`, {
        projectId: project._id,
        userId: userId,
      });
      alert('Postulación realizada con éxito');
    } catch (err) {
      console.error('Error al realizar la postulación', err);
      alert('Error al realizar la postulación');
    }
  };

  if (loading) {
    return <Container className="text-center text-gray-700">Cargando detalles del proyecto...</Container>;
  }

  if (error) {
    return <Container className="text-center text-red-600">{error}</Container>;
  }

  return (
    <Container maxWidth="md">
      <Card elevation={3}>
        {project.bannerImage && (
          <CardMedia
            component="img"
            height="240" // Cambia esta propiedad para ajustar la altura
            image={project.bannerImage}
            alt="Imagen del Proyecto"
            sx={{
              objectFit: 'cover', // Asegúrate de que la imagen cubra el espacio disponible
              width: '100%', // Asegúrate de que la imagen ocupe el 100% del ancho
              maxHeight: '240px', // Limita la altura máxima
            }}
          />
        )}
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            {project.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {project.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Requisitos:</strong> {project.requirements}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Tipo:</strong> {project.type}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Fecha de Inicio:</strong> {new Date(project.startDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Fecha de Fin:</strong> {new Date(project.endDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Voluntarios Requeridos:</strong> {project.volunteersRequired}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Tipo de Proyecto:</strong> {project.projectType}
              </Typography>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button
              onClick={handlePostulation}
              variant="contained"
              color="primary"
              fullWidth
            >
              Postularse
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Postulation;
