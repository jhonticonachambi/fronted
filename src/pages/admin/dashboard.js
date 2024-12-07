
import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import API_URL from '../../config/apiConfig'; // Importar API_URL
import ProjectTasksChart from './ProjectTasksChart'; // Asegúrate de que esta importación sea correcta y única

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [setChartData] = useState({ labels: [], values: [] });

  const fetchDashboardData = async () => {
    try {
      const projectsResponse = await axios.get(`${API_URL}/projects`); // Usar API_URL
      setProjects(projectsResponse.data);

      const volunteersResponse = await axios.get(`${API_URL}/auth/count/volunteers`); // Usar API_URL
      setUsersCount(volunteersResponse.data.count);

      const tasksResponse = await axios.get(`${API_URL}/tasks/count`); // Usar API_URL
      setTasksCount(tasksResponse.data.count);

      setChartData({
        labels: projectsResponse.data.map(project => project.name),
        values: projectsResponse.data.map(project => project.value || 0)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" className="mb-4">Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Usuarios Voluntarios</Typography>
              <Typography variant="h2">{usersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Proyectos</Typography>
              <Typography variant="h2">{projects.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Tareas</Typography>
              <Typography variant="h2">{tasksCount}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Lista de Proyectos</Typography>
              {projects.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Nombre</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Descripción</th>
                      <th style={{ border: '1px solid #ccc', padding: '8px' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{project.name}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{project.description}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{project.status}</td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Typography>No hay proyectos disponibles</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Agrega el componente ProjectTasksChart aquí */}
        <Grid item xs={12} sm={6} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Taller de Educación Financiera</Typography>
              <ProjectTasksChart projectId="6750a88dfeb4ee402ad3fdc7" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
    </Container>
  );
};

export default Dashboard;
