import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import SearchBar from '../../components/SearchBar';
import PostulationsTable from '../../components/PostulationsTable';

const Platform = () => {
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (!token) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Bienvenido, {username}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Esta plataforma es un espacio diseñado para facilitar tu postulación a proyectos de voluntariado. Aquí puedes explorar diversas oportunidades y conectarte con organizaciones que buscan voluntarios apasionados como tú. 
          Utiliza la barra de búsqueda para encontrar proyectos específicos que se alineen con tus intereses y habilidades.
        </Typography>
      </Box>
      
      {/* Search Bar */}
      <Box mb={4} display="flex" justifyContent="center">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </Box>

      {/* Postulations Table */}
      <Box bgcolor="white" boxShadow={3} borderRadius={2} p={3}>
        <PostulationsTable searchTerm={searchTerm} />
      </Box>
    </Container>
  );
};

export default Platform;
