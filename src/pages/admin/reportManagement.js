import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Breadcrumbs,
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../config/apiConfig'; // Importa la configuración de la API

const ReportManagement = () => {
  const [projects, setProjects] = useState([]);

  // Función para obtener proyectos
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`); // Usa API_URL en la solicitud
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
        <Link to="/dashboard">Dashboard</Link>
        <Typography color="text.primary">Report Management</Typography>
      </Breadcrumbs>

      <Typography variant="h4" className="mb-4">Report Management</Typography>
      {projects.length > 0 ? (
        projects.map((project) => (
          <Card key={project._id} className="mb-4">
            <CardContent>
              <Typography variant="h5">
                <Link to={`/report/${project._id}`} className="text-blue-500 hover:underline">
                  {project.name}
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                {project.description || 'Sin descripción disponible.'}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to={`/report/${project._id}`} 
                sx={{ mt: 1 }}
              >
                Ver Reporte
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No hay proyectos disponibles</Typography>
      )}
    </Container>
  );
};

export default ReportManagement;
