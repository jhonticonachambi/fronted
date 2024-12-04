import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Breadcrumbs } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../../config/apiConfig';

const ReportManagement = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Error al cargar los proyectos.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDownload = async (projectId) => {
    try {
      const response = await axios.get(`${API_URL}/report/reporte-general/${projectId}`, {
        responseType: 'blob',
      });

      // Crea una URL para el blob de la respuesta
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-general-${projectId}.pdf`);  // Nombre del archivo

      // Permite que el navegador muestre el cuadro de diálogo de descarga (comportamiento de descarga del navegador)
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error al descargar el reporte:', err);
      setError('No se pudo descargar el reporte.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link to="/dashboard" style={{ color: '#1976d2', textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Gestión de Reportes</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 4 }}>Gestión de Reportes</Typography>

      <Grid container spacing={4}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                    onClick={() => handleDownload(project._id)}
                    sx={{ mt: 1 }}
                  >
                    Descargar Reporte
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No hay proyectos disponibles</Typography>
        )}
      </Grid>

      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
};

export default ReportManagement;
