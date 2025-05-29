import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Chip,
  Snackbar,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import API_URL from '../../config/apiConfig';

const PersonalInfoForm = ({ userData, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    address: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        dni: userData.dni || '',
        phone: userData.phone || '',
        address: userData.address || '',
        skills: userData.skills || []
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/update-personal-info`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsEditing(false);
      setNotification({
        open: true,
        message: 'Información actualizada correctamente',
        severity: 'success'
      });
      
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      console.error('Error al actualizar:', err);
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Error al actualizar',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      p: 4, 
      borderRadius: '12px',
      backgroundColor: 'background.paper',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Header con acciones */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          fontSize: '1.25rem'
        }}>
          Información Personal
        </Typography>
        
        {!isEditing ? (
          <Button
            startIcon={<EditIcon sx={{ fontSize: '1.1rem' }} />}
            onClick={() => setIsEditing(true)}
            variant="contained"
            size="medium"
            sx={{
              borderRadius: '8px',
              px: 3,
              py: 1,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Editar información
          </Button>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<CloseIcon sx={{ fontSize: '1.1rem' }} />}
              onClick={() => setIsEditing(false)}
              variant="outlined"
              color="error"
              size="medium"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                textTransform: 'none',
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              startIcon={<SaveIcon sx={{ fontSize: '1.1rem' }} />}
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="medium"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              Guardar cambios
            </Button>
          </Stack>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {!isEditing ? (
        /* MODO VISUALIZACIÓN - PREMIUM */
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                color: 'text.secondary',
                mb: 1,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                Nombre Completo
              </Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 500,
                fontSize: '1rem'
              }}>
                {formData.name || 'No especificado'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                color: 'text.secondary',
                mb: 1,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                Teléfono
              </Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 500,
                fontSize: '1rem'
              }}>
                {formData.phone || 'No especificado'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                color: 'text.secondary',
                mb: 1,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                DNI
              </Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 500,
                fontSize: '1rem'
              }}>
                {formData.dni || 'No especificado'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ 
                color: 'text.secondary',
                mb: 1,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                Dirección
              </Typography>
              <Typography variant="body1" sx={{ 
                fontWeight: 500,
                fontSize: '1rem'
              }}>
                {formData.address || 'No especificado'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" sx={{ 
                color: 'text.secondary',
                mb: 1,
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                Habilidades
              </Typography>
              {formData.skills?.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {formData.skills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      sx={{ 
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 500,
                        px: 1,
                        py: 0.5
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ 
                  color: 'text.disabled',
                  fontStyle: 'italic'
                }}>
                  No se han añadido habilidades
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      ) : (
        /* MODO EDICIÓN - PREMIUM */
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={formData.address}
                onChange={handleChange}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  mb: 2,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary'
                }}>
                  Habilidades
                </Typography>
                
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  {formData.skills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      onDelete={() => handleRemoveSkill(skill)}
                      sx={{ 
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.contrastText',
                          opacity: 0.8,
                          '&:hover': {
                            opacity: 1
                          }
                        }
                      }}
                    />
                  ))}
                </Stack>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    fullWidth
                    label="Añadir nueva habilidad"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderWidth: '2px'
                        }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: '8px',
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      minWidth: '140px',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    Añadir
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Notificación premium */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          onClose={handleCloseNotification}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            alignItems: 'center'
          }}
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalInfoForm;