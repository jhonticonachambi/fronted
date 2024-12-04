import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, FormControl, Select, MenuItem, InputLabel, Breadcrumbs, Link } from '@mui/material';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css'; // Importar estilos
import 'datatables.net'; // Funcionalidades principales de DataTables
import API_URL from '../../../config/apiConfig'; // Importa la URL de la API

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const navigate = useNavigate();

    // Fetch projects and tasks
    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchTasksByProject(selectedProject);
        } else {
            fetchTasks();
        }
    }, [selectedProject]);

    // Fetch projects
    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/projects`); // Usar la URL de la API
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`); // Usar la URL de la API
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Fetch tasks by selected project
    const fetchTasksByProject = async (projectId) => {
        try {
            const response = await axios.get(`${API_URL}/tasks/project/${projectId}`); // Usar la URL de la API
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks by project:', error);
        }
    };

    // Navigate to edit task
    const handleEdit = (taskId) => {
        navigate(`/Editar-Tarea/${taskId}`);
    };

    // Navigate to view task
    const handleView = (taskId) => {
        navigate(`/view-task/${taskId}`);
    };

    // Handle task deletion
    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${API_URL}/tasks/${taskId}`); // Usar la URL de la API
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Initialize DataTable after tasks are loaded
    useEffect(() => {
        if (tasks.length > 0) {
            $('#taskTable').DataTable(); // Inicializa DataTables en el elemento con ID taskTable
        }
    }, [tasks]);

    return (
        <Box sx={{ padding: '30px', backgroundColor: '#f4f6f9' }}>
            {/* Breadcrumb */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '20px' }}>
                <Link color="inherit" href="/dashboard" underline="hover">Dashboard</Link>
                <Typography color="textPrimary">Gestión de Tareas</Typography>
            </Breadcrumbs>


            {/* Filtros */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Button variant="contained" color="primary" onClick={() => navigate('/Agregar-Tarea')}>
                    Agregar Tarea
                </Button>
                <FormControl variant="outlined" style={{ minWidth: 200 }}>
                    <InputLabel>Proyecto</InputLabel>
                    <Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} label="Proyecto">
                        <MenuItem value=''><em>Todos los Proyectos</em></MenuItem>
                        {projects.map((project) => (
                            <MenuItem key={project._id} value={project._id}>{project.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Tabla de Tareas */}
            <Box sx={{ overflow: 'auto', backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <table id="taskTable" className="display" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Asignado a</th>
                            <th>Proyecto</th>
                            <th>Estado</th>
                            <th>Prioridad</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>
                                    {task.assignedTo.map((user) => (
                                        <span key={user._id}>{user.name}</span>
                                    ))}
                                </td>
                                <td>{task.project.name}</td>
                                <td>{task.status}</td>
                                <td>{task.priority}</td>
                                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="contained" color="info" onClick={() => handleView(task._id)}><FaEye /></Button>
                                    <Button variant="contained" color="warning" onClick={() => handleEdit(task._id)}><FaEdit /></Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(task._id)}><FaTrash /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default TaskList;
