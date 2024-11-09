// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import API_URL from '../../../config/apiConfig';
// import './CreateProject.css'; // Importamos el archivo CSS personalizado

// const CreateProject = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     requirements: '',
//     type: '',
//     startDate: '',
//     endDate: '',
//     volunteersRequired: '',
//     projectType: '',
//     bannerImage: '',
//     organizer: '',
//   });

//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//     } else {
//       const storedUserId = localStorage.getItem('userId');
//       setFormData((prevData) => ({
//         ...prevData,
//         organizer: storedUserId,
//       }));
//     }
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({});
//     setSuccessMessage('');

//     try {
//       const response = await axios.post(`${API_URL}/projects`, formData);
//       setSuccessMessage('Proyecto creado exitosamente.');
//       setOpenSnackbar(true);
//     } catch (error) {
//       if (error.response && error.response.data.errors) {
//         setErrors(error.response.data.errors.reduce((acc, curr) => {
//           acc[curr.param] = curr.msg;
//           return acc;
//         }, {}));
//       } else {
//         setErrors({ general: 'Error en el servidor. Intenta nuevamente.' });
//       }
//     }
//   };

//   return (
//     <div className="container mt-5">
//       {/* Breadcrumbs */}
//       <nav className="mb-4">
//         <ol className="breadcrumb">
//           <li className="breadcrumb-item">
//             <Link to="/dashboard" className="text-blue-500 hover:underline">Inicio</Link>
//           </li>
//           <li className="breadcrumb-item" aria-current="page">
//             <Link to="/gestion-de-proyectos" className="text-blue-500 hover:underline">Gestión de Proyectos</Link>
//           </li>
//           <li className="breadcrumb-item active" aria-current="page">
//             Nuevo Proyecto
//           </li>
//         </ol>
//       </nav>

//       <div className="card">
//         <div className="card-header text-start">
//           <h2>Crear Proyecto</h2>
//         </div>
//         <div className="card-body">
//           <form onSubmit={handleSubmit} className="text-start">
//             <div className="row g-3">
//               {[
//                 { name: 'name', label: 'Nombre del Proyecto' },
//                 { name: 'description', label: 'Descripción' },
//                 { name: 'requirements', label: 'Requerimientos' },
//                 { name: 'type', label: 'Tipo de Proyecto' },
//                 { name: 'startDate', label: 'Fecha de Inicio', type: 'date' },
//                 { name: 'endDate', label: 'Fecha de Fin', type: 'date' },
//                 { name: 'volunteersRequired', label: 'Voluntarios Requeridos' },
//                 { name: 'projectType', label: 'Tipo de Proyecto' },
//                 { name: 'bannerImage', label: 'Imagen del Banner' },
//               ].map(({ name, label, type = 'text' }) => (
//                 <div key={name} className="col-md-6">
//                   <label htmlFor={name} className="form-label">
//                     {label}
//                   </label>
//                   <input
//                     type={type}
//                     id={name}
//                     name={name}
//                     value={formData[name]}
//                     onChange={handleChange}
//                     required
//                     readOnly={name === 'organizer'}
//                     className={`form-control same-width ${errors[name] ? 'is-invalid' : ''}`} // Añadimos una clase personalizada
//                   />
//                   {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
//                 </div>
//               ))}
//             </div>

//             <input type="hidden" name="organizer" value={formData.organizer} />

//             <div className="form-check mt-4">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 id="terms"
//                 required
//               />
//               <label className="form-check-label" htmlFor="terms">
//                 Acepto los términos y condiciones
//               </label>
//             </div>

//             <div className="mt-4">
//               <button type="submit" className="btn btn-primary w-100">
//                 Crear Proyecto
//               </button>
//             </div>

//             {errors.general && <div className="text-danger mt-3">{errors.general}</div>}

//             {openSnackbar && (
//               <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
//                 {successMessage}
//                 <button type="button" className="btn-close" onClick={() => setOpenSnackbar(false)}></button>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateProject;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../../config/apiConfig';
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
import 'react-data-table-component-extensions/dist/index.css';
import DataTableExtensions from 'react-data-table-component-extensions';

const TaskManagement = () => {
  const [projects, setProjects] = useState([]);
  const [postulations, setPostulations] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [tasks, setTasks] = useState([]);
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
        setTasks(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProjects();
    fetchTasks();
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

  const tableData = {
    columns,
    data: tasks,
  };

  return (
    <Box p={3}> {/* Añade espacio a los lados */}
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard" className="text-blue-500 hover:underline">Inicio</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Gestión de Tareas
          </li>
        </ol>
      </nav>

      <Typography variant="h4" gutterBottom>Asignar Tareas</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
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

      {/* DataTable con opciones avanzadas */}
      <Box mt={3}>
        <Typography variant="h5" gutterBottom>Lista de Tareas</Typography>
        <DataTableExtensions {...tableData} exportHeaders pagination>
          <DataTable
            columns={columns}
            data={tasks}
            pagination
            highlightOnHover
            dense
          />
        </DataTableExtensions>
      </Box>
    </Box>
  );
};

export default TaskManagement;
