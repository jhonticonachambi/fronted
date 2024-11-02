import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';
import API_URL from '../../config/apiConfig'; // Importa la URL de la API desde el archivo de configuración

const Profile = () => {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await axios.get(`${API_URL}/auth/profile`, { // Usar API_URL aquí
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los headers
          },
        });
        console.log(response.data); // Aquí puedes ver los datos del usuario en la consola
        setUser(response.data); // Guardar los datos del usuario en el estado
        setLoading(false); // Desactivar la carga
      } catch (err) {
        setError('Error al cargar el perfil del usuario'); // Manejar errores
        setLoading(false); // Desactivar la carga en caso de error
      }
    };
  
    fetchUserProfile(); // Llamar a la función para obtener los datos del perfil
  }, []);

  // Si los datos están cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6">Cargando perfil del usuario...</Typography>
      </Container>
    );
  }

  // Si hay un error, mostrar el mensaje de error
  if (error) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  // Si los datos se cargaron correctamente, mostrar los detalles del usuario
  if (user) {
    return (
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                alt="Profile"
                src="https://via.placeholder.com/150" // Foto de perfil de ejemplo
                sx={{ width: 80, height: 80, marginRight: 2 }}
              />
              <Box>
                <Typography variant="h5">{user.name}</Typography>
                <Typography color="textSecondary">{user.email}</Typography>
              </Box>
              <Button variant="outlined" sx={{ marginLeft: 'auto' }}>
                Cambiar Foto
              </Button>
            </Box>

            <Typography variant="h6" gutterBottom>Detalles de la Cuenta</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre Completo"
                  value={user.name}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={user.email}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  value={user.phone}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dirección"
                  value={user.address}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Habilidades"
                  value={user.skills.join(', ')}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rol"
                  value={user.role === 'volunteer' ? 'Voluntario' : 'Administrador'}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            <Box textAlign="right" mt={3}>
              <Button variant="contained" color="primary">
                Actualizar Información
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return null; // Devolver null si no hay datos
};

export default Profile;
