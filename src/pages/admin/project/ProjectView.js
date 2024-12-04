import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid, Paper, Typography, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import API_URL from '../../../config/apiConfig';

const ProjectDetails = () => {
  const { id } = useParams(); // Obtenemos el id del proyecto de la URL
  const [project, setProject] = useState(null);
  const [postulations, setPostulations] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects/info/${id}`); // Asegúrate de usar la URL correcta de tu API
        setProject(response.data.project);
        setPostulations(response.data.postulations);
        setTasks(response.data.tasks); // Guardamos las tareas también
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los detalles del proyecto:', error);
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!project) {
    return <p>No se encontraron detalles para este proyecto.</p>;
  }

  return (
    <Box sx={{ padding: 3, maxWidth: '90%', margin: '0 auto' }}>
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" gutterBottom>{project.name}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img
            src={project.bannerImage}
            alt="Banner del proyecto"
            style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px' }}
          />
        </Box>
        <br></br>
        <Typography variant="body1"> <strong>Descripcion:</strong> {project.description}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Tipo de Proyecto:</strong> {project.projectType}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Fecha de Inicio:</strong> {new Date(project.startDate).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Fecha de Finalización:</strong> {new Date(project.endDate).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Voluntarios Requeridos:</strong> {project.volunteersRequired}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>Estado:</strong> {project.status}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Contenedor de Postulantes y Tareas en columnas */}
      <Grid container spacing={3}>
        {/* Postulantes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, maxHeight: '300px', overflowY: 'auto' }}>
            <Typography variant="h5" gutterBottom>Postulantes</Typography>
            {postulations.length > 0 ? (
              <List>
                {postulations.map((postulation) => (
                  <ListItem key={postulation._id} divider>
                    <ListItemText
                      primary={`${postulation.userId.name} - ${postulation.userId.email}`}
                      secondary={`Estado: ${postulation.status}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No hay postulantes para este proyecto.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Tareas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 3, maxHeight: '300px', overflowY: 'auto' }}>
            <Typography variant="h5" gutterBottom>Tareas</Typography>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Box key={task._id} sx={{ marginBottom: 3 }}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Divider sx={{ marginY: 1 }} />
                  <Typography><strong>Descripción:</strong> {task.description}</Typography>
                  <Typography><strong>Estado:</strong> {task.status}</Typography>
                  <Typography><strong>Prioridad:</strong> {task.priority}</Typography>
                  <Typography><strong>Fecha de Vencimiento:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No definida'}</Typography>

                  <Box sx={{ marginY: 2 }}>
                    <Typography variant="subtitle1"><strong>Asignados:</strong></Typography>
                    <List>
                      {task.assignedTo.map((user) => (
                        <ListItem key={user._id} divider>
                          <ListItemText
                            primary={`${user.name} (${user.email})`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1"><strong>Comentarios:</strong></Typography>
                    {task.comments.length > 0 ? (
                      task.comments.map((comment, index) => (
                        <Box key={index} sx={{ marginBottom: 1 }}>
                          <Typography><strong>{comment.user.name}:</strong> {comment.comment}</Typography>
                          <Typography variant="body2" color="textSecondary">{new Date(comment.date).toLocaleString()}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography>No hay comentarios para esta tarea.</Typography>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <Typography>No hay tareas asociadas a este proyecto.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetails;
