import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Paper, Box, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../../../config/apiConfig'; // Importar la URL de la API

const EditTask = () => {
    const { taskId } = useParams();
    const [projects, setProjects] = useState([]);
    const [postulations, setPostulations] = useState([]);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            assignedTo: [],
            project: '',
            status: 'pending',
            priority: 'medium',
            dueDate: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('El título es obligatorio'),
            description: Yup.string().required('La descripción es obligatoria'),
            assignedTo: Yup.array().min(1, 'Debe asignar al menos un usuario'),
            project: Yup.string().required('El proyecto es obligatorio'),
            dueDate: Yup.date().required('La fecha de vencimiento es obligatoria'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await axios.put(`${API_URL}/tasks/${taskId}`, values, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                navigate('/Tareas');
                setSubmitting(false);
            } catch (error) {
                console.error('Error updating task:', error);
                setSubmitting(false);
            }
        },
    });

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchUsersByProject = async (projectId) => {
        try {
            const response = await axios.get(`${API_URL}/postulations/project/${projectId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const acceptedPostulations = response.data.filter(postulation => 
                postulation.status === 'aceptado' || postulation.status === 'accepted'
            );
            setPostulations(acceptedPostulations);
        } catch (error) {
            console.error('Error fetching users by project:', error);
        }
    };

    const fetchTaskDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks/${taskId}`);
            const taskData = response.data;

            formik.setValues({
                title: taskData.title,
                description: taskData.description,
                assignedTo: taskData.assignedTo.map(user => user._id),
                project: taskData.project._id,
                status: taskData.status,
                priority: taskData.priority,
                dueDate: taskData.dueDate.split('T')[0],
            });

            await fetchUsersByProject(taskData.project._id);
        } catch (error) {
            console.error('Error fetching task details:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchTaskDetails();
    }, []);

    useEffect(() => {
        if (formik.values.project) {
            fetchUsersByProject(formik.values.project);
        }
    }, [formik.values.project]);

    const handleCheckBoxChange = (event) => {
        const { value } = event.target;
        const newAssignedTo = formik.values.assignedTo.includes(value)
            ? formik.values.assignedTo.filter(id => id !== value)
            : [...formik.values.assignedTo, value];
        formik.setFieldValue('assignedTo', newAssignedTo);
    };

    return (
        <Paper style={{ maxWidth: 600, margin: '20px auto', padding: '20px' }}>
            <Typography variant="h4" component="div" style={{ textAlign: 'center', margin: '20px 0' }}>
                Editar Tarea
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    select
                    label="Seleccionar Proyecto"
                    fullWidth
                    margin="dense"
                    value={formik.values.project}
                    onChange={(e) => {
                        formik.setFieldValue('project', e.target.value);
                    }}
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
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                />

                <TextField
                    label="Descripción"
                    name="description"
                    fullWidth
                    multiline
                    rows={4}
                    margin="dense"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />

                <TextField
                    select
                    label="Estado"
                    name="status"
                    fullWidth
                    margin="dense"
                    value={formik.values.status}
                    onChange={formik.handleChange}
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
                    value={formik.values.priority}
                    onChange={formik.handleChange}
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
                    value={formik.values.dueDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputLabelProps={{ shrink: true }}
                    required
                    error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                    helperText={formik.touched.dueDate && formik.errors.dueDate}
                />

                <Typography variant="subtitle1" gutterBottom>Asignar a Usuarios:</Typography>
                {postulations.map((postulation) => (
                    <FormControlLabel
                        key={postulation.userId._id}
                        control={
                            <Checkbox
                                name="assignedTo"
                                value={postulation.userId._id}
                                checked={formik.values.assignedTo.includes(postulation.userId._id)}
                                onChange={handleCheckBoxChange}
                            />
                        }
                        label={postulation.userId.name}
                    />
                ))}

                <Button type="submit" variant="contained" color="primary" fullWidth disabled={formik.isSubmitting}>
                    Actualizar Tarea
                </Button>
            </Box>
        </Paper>
    );
};

export default EditTask;
