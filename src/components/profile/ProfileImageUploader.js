import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Card
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import API_URL from '../../config/apiConfig';

const ProfileImageUploader = ({ userData, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      const imageUrl = userData.profileImage?.url || '';
      setUrl(imageUrl);
    }
  }, [userData]);
  const handleChange = (e) => {
    setUrl(e.target.value);
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

      await axios.put(
        `${API_URL}/volunteer/profile-image/${userId}`,
        {
          url: url,
          altText: 'Imagen de perfil'
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
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error('Error al actualizar la imagen de perfil:', err);
      
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
  };  return (
    <Card>
      <Box>
        <Typography variant="h5">Imagen de Perfil</Typography>
        <Button 
          variant={isEditing ? "outlined" : "contained"}
          startIcon={isEditing ? null : <EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          color={isEditing ? "error" : "primary"}
          size="small"
        >
          {isEditing ? "Cancelar" : "Cambiar Imagen"}
        </Button>
      </Box>

      <Box>
        <Avatar 
          src={url || "https://cdn-icons-png.flaticon.com/512/3135/3135768.png"}
          alt="Imagen de perfil"
        />
        
        {isEditing && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="URL de la imagen"
              value={url}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              placeholder="https://ejemplo.com/mi-imagen.jpg"
              helperText="Ingresa la URL de la imagen"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !url}
              startIcon={loading ? <CircularProgress size={20} /> : <PhotoCamera />}
            >
              {loading ? 'Actualizando...' : 'Guardar Imagen'}
            </Button>
          </form>
        )}
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
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ProfileImageUploader;
