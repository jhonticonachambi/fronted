//pages/admin/taskManagement
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/apiConfig';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import DataTable from 'react-data-table-component';

const TaskManagement = () => {
  const [projects, setProjects] = useState([]);
  const [postulations, setPostulations] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tasks, setTasks] = useState([]); // Estado para las tareas
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    assignedTo: [],
    status: 'pending', 
    priority: 'medium', 
    dueDate: '', 
  });
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProjects(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(response.data); // Asigna las tareas al estado
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProjects();
    fetchTasks(); // Llama a fetchTasks para cargar las tareas al inicio
  }, []);

  useEffect(() => {
    const fetchPostulations = async () => {
      if (selectedProject) {
        try {
          const response = await axios.get(`${API_URL}/postulaciones/proyecto/${selectedProject}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const acceptedPostulations = response.data.filter(postulation => 
            postulation.status === 'aceptado' || postulation.status === 'accepted'
          );
          setPostulations(acceptedPostulations);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchPostulations();
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'assignedTo') {
      const newAssignedTo = taskDetails.assignedTo.includes(value)
        ? taskDetails.assignedTo.filter(id => id !== value)
        : [...taskDetails.assignedTo, value];
      setTaskDetails(prev => ({ ...prev, assignedTo: newAssignedTo }));
    } else {
      setTaskDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (taskId) => {
    // Lógica para editar la tarea con el ID dado
    console.log("Editar tarea con ID:", taskId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks`, {
        ...taskDetails,
        project: selectedProject,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTaskDetails({
        title: '',
        description: '',
        assignedTo: [],
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
      setPostulations([]);
      setSelectedProject('');
      setOpen(false); 
      // Actualiza las tareas después de agregar una nueva
      const updatedTasks = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(updatedTasks.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error al crear la tarea');
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Configuración de columnas para el DataTable
  const columns = [
    { name: 'Título', selector: row => row.title, sortable: true },
    { name: 'Descripción', selector: row => row.description },
    { name: 'Prioridad', selector: row => row.priority, sortable: true },
    { name: 'Estado', selector: row => row.status, sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <Button
          onClick={() => handleEdit(row.id)}
          color="primary"
          variant="contained"
        >
          Editar
        </Button>
      ),
    },
  ];
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Asignar Tareas</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Nueva Tarea
      </Button>



      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nueva Tarea</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              select
              label="Seleccionar Proyecto"
              fullWidth
              margin="dense"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              required
            >
              <MenuItem value=""><em>-- Seleccionar Proyecto --</em></MenuItem>
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Título"
              name="title"
              fullWidth
              margin="dense"
              value={taskDetails.title}
              onChange={handleChange}
              required
            />

            <TextField
              label="Descripción"
              name="description"
              fullWidth
              multiline
              rows={4}
              margin="dense"
              value={taskDetails.description}
              onChange={handleChange}
              required
            />

            <TextField
              select
              label="Estado"
              name="status"
              fullWidth
              margin="dense"
              value={taskDetails.status}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pendiente</MenuItem>
              <MenuItem value="in progress">En Progreso</MenuItem>
              <MenuItem value="completed">Completado</MenuItem>
              <MenuItem value="archived">Archivado</MenuItem>
            </TextField>

            <TextField
              select
              label="Prioridad"
              name="priority"
              fullWidth
              margin="dense"
              value={taskDetails.priority}
              onChange={handleChange}
            >
              <MenuItem value="low">Baja</MenuItem>
              <MenuItem value="medium">Media</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
            </TextField>

            <TextField
              label="Fecha de Vencimiento"
              name="dueDate"
              type="date"
              fullWidth
              margin="dense"
              value={taskDetails.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="subtitle1" gutterBottom>Asignar a Usuarios:</Typography>
            {postulations.map((postulation) => (
              <FormControlLabel
                key={postulation.userId._id}
                control={
                  <Checkbox
                    name="assignedTo"
                    value={postulation.userId._id}
                    checked={taskDetails.assignedTo.includes(postulation.userId._id)}
                    onChange={handleChange}
                  />
                }
                label={postulation.userId.name}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary" type="submit">Crear Tarea</Button>
        </DialogActions>
      </Dialog>

      {/* DataTable para mostrar la lista de tareas */}
      <Box mt={3}>

      <Typography variant="h5" gutterBottom>Lista de Tareas</Typography>
      <DataTable
        columns={columns}
        data={tasks}
        pagination
        highlightOnHover
      />
      </Box>
      
    </Box>
  );
};

export default TaskManagement;
