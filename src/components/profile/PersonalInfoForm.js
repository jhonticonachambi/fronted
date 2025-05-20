import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper, 
  Chip,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import API_URL from '../../config/apiConfig';

const PersonalInfoForm = ({ userData, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    address: '',
    skills: [],
    phone: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (userData) {
      // Inicializar el formulario con los datos actuales del usuario
      setFormData({
        name: userData.name || '',
        dni: userData.dni || '',
        address: userData.address || '',
        skills: userData.skills || [],
        phone: userData.phone || ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      // Intenta con la ruta correcta basada en la estructura de tu API
      const response = await axios.put(`${API_URL}/auth/update-personal-info`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsEditing(false);
      setNotification({
        open: true,
        message: 'Información personal actualizada con éxito',
        severity: 'success'
      });
      
      // Notificar al componente padre que se actualizó la información
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }    } catch (err) {
      console.error('Error al actualizar la información personal:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      console.error('Código de estado:', err.response?.status);
      
      setNotification({
        open: true,
        message: `Error al actualizar la información personal: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };
  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button 
          variant={isEditing ? "outlined" : "contained"}
          startIcon={isEditing ? null : <EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          color={isEditing ? "error" : "primary"}
          size="small"
          sx={{ borderRadius: '20px' }}
        >
          {isEditing ? "Cancelar" : "Editar Información"}
        </Button>
      </Box>

      {!isEditing ? (
        // Modo de visualización
        <Box sx={{ p: 3, pt: 0 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: '8px',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#2e7d32', 
                    mr: 1 
                  }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Nombre Completo
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formData.name || 'No especificado'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: '8px',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#2e7d32', 
                    mr: 1 
                  }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    DNI
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formData.dni || 'No especificado'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: '8px',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#2e7d32', 
                    mr: 1 
                  }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Teléfono
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formData.phone || 'No especificado'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={6}>
              <Box sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: '8px',
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#2e7d32', 
                    mr: 1 
                  }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Dirección
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {formData.address || 'No especificado'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 2, 
                borderRadius: '8px',
                mt: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#2e7d32', 
                    mr: 1 
                  }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Habilidades
                  </Typography>
                </Box>
                
                {formData.skills && formData.skills.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        sx={{ 
                          bgcolor: '#e8f5e9', 
                          color: '#2e7d32',
                          fontWeight: 'medium',
                          '&:hover': { bgcolor: '#c8e6c9' }
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No has especificado habilidades
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : (
        // Modo de edición
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, pt: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Habilidades
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2, gap: 1 }}>
                {formData.skills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ 
                      bgcolor: '#e8f5e9', 
                      color: '#2e7d32',
                      fontWeight: 'medium',
                      '&:hover': { bgcolor: '#c8e6c9' }
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Nueva habilidad"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    mr: 1, 
                    flex: 1,
                    '.MuiOutlinedInput-root': { borderRadius: '8px' }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  sx={{ borderRadius: '8px' }}
                >
                  <AddIcon />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ 
                  borderRadius: '8px',
                  py: 1.2,
                  fontWeight: 'bold',
                  boxShadow: 2
                }}
              >
                Guardar Cambios
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalInfoForm;
