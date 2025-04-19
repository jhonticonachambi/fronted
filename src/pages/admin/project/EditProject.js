// pages/admin/project
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate,Link } from 'react-router-dom';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
} from '@mui/material';
import API_URL from '../../../config/apiConfig'; // Importa la configuración de tu API

const EditProject = () => {
  const { id } = useParams(); // Obtiene el ID del proyecto
  const navigate = useNavigate(); // Hook para redirecciones

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({
    name: '',
    description: '',
    requirements: '',
    type: '',
    startDate: '',
    endDate: '',
    volunteersRequired: '',
    projectType: '',
    bannerImage: '',
    status: 'activo',
  });

  const [errors, setErrors] = useState({});

  // Validación del formulario con Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre del proyecto es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    requirements: Yup.string().required('Los requisitos son obligatorios'),
    type: Yup.string().required('El tipo de proyecto es obligatorio'),
    startDate: Yup.date().required('La fecha de inicio es obligatoria'),
    endDate: Yup.date().required('La fecha de finalización es obligatoria'),
    volunteersRequired: Yup.number().required('El número de voluntarios es obligatorio'),
    projectType: Yup.string().required('El tipo de proyecto es obligatorio'),
    bannerImage: Yup.string().url('La URL de la imagen no es válida').required('La URL de la imagen es obligatoria'),
    status: Yup.string().required('El estado del proyecto es obligatorio'),
  });

  useEffect(() => {
    // Carga los datos del proyecto
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_URL}/projects/${id}`);
        const data = response.data;

      // Asegurarse de que las fechas están en formato yyyy-mm-dd
      const startDate = new Date(data.startDate).toISOString().split('T')[0];
      const endDate = new Date(data.endDate).toISOString().split('T')[0];

      setProject({
        ...data,
        startDate: startDate,
        endDate: endDate,
      });
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(project, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (isValid) {
      try {
        await axios.put(`${API_URL}/projects/${id}`, project);
        navigate('/gestion-de-proyectos'); // Redirige al dashboard
      } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div className="flex-1 p-6 bg-gray-100">
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="flex space-x-2">
          <li>
            <Link to="/dashboard" className="text-blue-500 hover:underline">Inicio</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/gestion-de-proyectos" className="text-blue-500 hover:underline">Gestión de Proyectos</Link>
          </li>
          <li>/</li>
          <li>
            <span className="text-gray-600">Editar Proyecto</span>
          </li>
        </ol>
      </nav>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Proyecto"
              name="name"
              value={project.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              name="description"
              multiline
              rows={4}
              value={project.description}
              onChange={handleChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Requisitos"
              name="requirements"
              value={project.requirements}
              onChange={handleChange}
              error={Boolean(errors.requirements)}
              helperText={errors.requirements}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tipo de Proyecto"
              name="type"
              value={project.type}
              onChange={handleChange}
              error={Boolean(errors.type)}
              helperText={errors.type}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Inicio"
              name="startDate"
              type="date"
              value={project.startDate}
              onChange={handleChange}
              error={Boolean(errors.startDate)}
              helperText={errors.startDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Finalización"
              name="endDate"
              type="date"
              value={project.endDate}
              onChange={handleChange}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Número de Voluntarios Requeridos"
              name="volunteersRequired"
              type="number"
              value={project.volunteersRequired}
              onChange={handleChange}
              error={Boolean(errors.volunteersRequired)}
              helperText={errors.volunteersRequired}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL de la Imagen"
              name="bannerImage"
              value={project.bannerImage}
              onChange={handleChange}
              error={Boolean(errors.bannerImage)}
              helperText={errors.bannerImage}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="status"
                value={project.status}
                onChange={handleChange}
                error={Boolean(errors.status)}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="en progreso">En Progreso</MenuItem>
                <MenuItem value="finalizado">Finalizado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Actualizar Proyecto
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditProject;
