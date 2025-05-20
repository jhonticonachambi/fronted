import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  Card,
  CardContent
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import LinkIcon from '@mui/icons-material/Link';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import API_URL from '../../config/apiConfig';

const ProfileImageUploader = ({ userData, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    altText: ''
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
    if (userData) {
      // Inicializar con los datos existentes si están disponibles
      const url = userData.profileImage?.url || '';
      const altText = userData.profileImage?.altText || 'Imagen de perfil';
      
      setFormData({
        url,
        altText
      });
      
      if (url) {
        setImagePreview(url);
      }
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Si cambia la URL, resetear el estado de error de la imagen
    if (name === 'url') {
      setImageError(false);
    }
  };
  
  const validateImageUrl = (url) => {
    if (!url) return false;
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };
  
  const handlePreviewImage = async () => {
    if (!formData.url) return;
    
    setLoading(true);
    const isValid = await validateImageUrl(formData.url);
    
    if (isValid) {
      setImagePreview(formData.url);
      setImageError(false);
      setNotification({
        open: true,
        message: 'Imagen previsualizada correctamente',
        severity: 'success'
      });
    } else {
      setImageError(true);
      setNotification({
        open: true,
        message: 'No se puede cargar la imagen. Verifica la URL',
        severity: 'error'
      });
    }
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const userId = userData?._id;
      
      if (!userId) {
        throw new Error('ID de usuario no disponible');
      }
        // Usando la ruta correcta para la API
      const response = await axios.put(
        `${API_URL}/volunteer-profiles/profile-image/${userId}`,
        {
          url: formData.url,
          altText: formData.altText
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setIsEditing(false);
      setNotification({
        open: true,
        message: 'Imagen de perfil actualizada con éxito',
        severity: 'success'
      });
      
      // Notificar al componente padre que se actualizó la información
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error('Error al actualizar la imagen de perfil:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      console.error('Código de estado:', err.response?.status);
      
      setNotification({
        open: true,
        message: `Error al actualizar la imagen de perfil: ${err.response?.data?.message || err.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };
  return (
    <Card sx={{ borderRadius: '10px', overflow: 'hidden', boxShadow: 3, mt: 3 }}>
      <Box sx={{ 
        p: 3, 
        backgroundColor: '#f9f9f9', 
        borderBottom: '1px solid #eeeeee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Imagen de Perfil</Typography>
        <Button 
          variant={isEditing ? "outlined" : "contained"}
          startIcon={isEditing ? null : <EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          color={isEditing ? "error" : "primary"}
          size="small"
          sx={{ borderRadius: '20px' }}
        >
          {isEditing ? "Cancelar" : "Cambiar Imagen"}
        </Button>
      </Box>

      <Box sx={{ p: 3, backgroundColor: 'white' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <Avatar 
              src={formData.url || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
              alt={formData.altText}
              sx={{ 
                width: 180, 
                height: 180,
                border: '4px solid #e8f5e9',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: isEditing ? 'none' : 'scale(1.05)',
                  cursor: isEditing ? 'default' : 'pointer'
                }
              }}
            />
            {!isEditing && formData.url && (
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  maxWidth: '200px'
                }}
              >
                {formData.altText || 'Imagen de perfil'}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={8}>
            {!isEditing ? (
              // Modo de visualización
              <Box>
                {formData.url ? (
                  <Box sx={{ 
                    backgroundColor: '#f5f5f5', 
                    p: 2, 
                    borderRadius: '8px',
                    mb: 2
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
                        URL de la imagen
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        wordBreak: 'break-all', 
                        mb: 1,
                        maxWidth: '100%',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        p: 1,
                        borderRadius: '4px'
                      }}
                    >
                      {formData.url}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{
                    backgroundColor: '#fff8e1',
                    p: 2,
                    borderRadius: '8px',
                    border: '1px dashed #ffc107',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: '#ff6f00',
                        fontWeight: 'medium'
                      }}
                    >
                      No hay una imagen de perfil personalizada. Estás usando la imagen predeterminada.
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              // Modo de edición
              <form onSubmit={handleSubmit}>
                <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: '8px', mb: 3 }}>
                  <TextField
                    fullWidth
                    label="URL de la imagen"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    placeholder="https://ejemplo.com/mi-imagen.jpg"
                    helperText="Ingresa la URL de la imagen que quieres usar como perfil"
                    InputLabelProps={{ shrink: true }}
                    sx={{ '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                  <TextField
                    fullWidth
                    label="Texto alternativo"
                    name="altText"
                    value={formData.altText}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    placeholder="Descripción de la imagen para accesibilidad"
                    helperText="Una breve descripción de la imagen para accesibilidad"
                    InputLabelProps={{ shrink: true }}
                    sx={{ '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || !formData.url}
                  startIcon={loading ? <CircularProgress size={20} /> : <PhotoCamera />}
                  sx={{ 
                    borderRadius: '8px',
                    py: 1.2,
                    fontWeight: 'bold',
                    boxShadow: 2,
                    width: '100%'
                  }}
                >
                  {loading ? 'Actualizando...' : 'Guardar Imagen'}
                </Button>

                <Typography 
                  variant="caption" 
                  color="textSecondary" 
                  sx={{ 
                    display: 'block', 
                    mt: 2,
                    textAlign: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  * Para mejores resultados, usa una imagen cuadrada de al menos 200x200 píxeles.
                </Typography>
              </form>
            )}
          </Grid>
        </Grid>
      </Box>

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
    </Card>
  );
};

export default ProfileImageUploader;
