import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Snackbar, 
  Alert, 
  Breadcrumbs 
} from '@mui/material';
import API_URL from '../../config/apiConfig'; // Importar la configuración de la API

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirements: '',
    type: '',
    startDate: '',
    endDate: '',
    volunteersRequired: '',
    projectType: '',
    bannerImage: '',
    organizer: '', // Se establecerá automáticamente el ID del organizador
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // Para redirigir si es necesario

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage

    if (!token) {
      navigate('/login'); // Redirige al login si no hay token
    } else {
      const storedUserId = localStorage.getItem('userId'); // Obtén el _id del usuario
      setFormData((prevData) => ({
        ...prevData,
        organizer: storedUserId, // Establecer automáticamente el _id del organizador
      }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and success message
    setErrors({});
    setSuccessMessage('');

    try {
      // Usa la URL de la API importada
      const response = await axios.post(`${API_URL}/projects`, formData);
      console.log('Proyecto creado:', response.data);
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Proyecto creado exitosamente.');
      setOpenSnackbar(true); // Abrir Snackbar

    } catch (error) {
      console.error('Error al crear el proyecto:', error.response.data);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors.reduce((acc, curr) => {
          acc[curr.param] = curr.msg;
          return acc;
        }, {}));
      } else {
        setErrors({ general: 'Error en el servidor. Intenta nuevamente.' });
      }
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    navigate('/project-management'); // Redirige a Project Management después de cerrar el Snackbar
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/project-management">Project Management</Link>
        <Typography color="text.primary">Nuevo Proyecto</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Crear Proyecto
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        {Object.keys(formData).map((key) => (
          <TextField
            key={key}
            name={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            type={key.includes('Date') ? 'date' : 'text'}
            value={formData[key]}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={key === 'organizer' ? { shrink: true } : {}}
            inputProps={{ 
              readOnly: key === 'organizer', // Campo de organizador solo lectura
              style: { display: key === 'organizer' ? 'none' : 'block' } // Ocultar el campo de organizador
            }}
            sx={{ mb: 2 }}
            error={!!errors[key]}
            helperText={errors[key] || ''}
          />
        ))}
        {/* Campo del organizador invisible pero presente en el formulario */}
        <input 
          type="hidden" 
          name="organizer" 
          value={formData.organizer} 
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Crear Proyecto
        </Button>
        {errors.general && <Typography color="error">{errors.general}</Typography>}
      </form>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateProject;
