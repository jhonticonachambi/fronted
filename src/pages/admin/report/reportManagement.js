import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Breadcrumbs,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../../config/apiConfig';

const ReportManagement = () => {
  const [projects, setProjects] = useState([]);

  // Función para obtener proyectos
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link to="/dashboard" style={{ color: '#1976d2', textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Gestión de Reportes</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 4 }}>Gestión de Reportes</Typography>
      
      {/* Grid de tarjetas de proyectos */}
      <Grid container spacing={4}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Imagen del proyecto */}
                <CardMedia
                  component="img"
                  height="180"
                  image={project.bannerImage || 'https://via.placeholder.com/345x180?text=No+Image+Available'}
                  alt={project.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    <Link to={`/reporte/${project._id}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                      {project.name}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description || 'Sin descripción disponible.'}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    to={`/reporte/${project._id}`} 
                    sx={{ mt: 1 }}
                  >
                    Ver Reporte
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No hay proyectos disponibles</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ReportManagement;
