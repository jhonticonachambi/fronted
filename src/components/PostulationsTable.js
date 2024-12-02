import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography } from '@mui/material';
import API_URL from '../config/apiConfig'; // Importar la URL de la API

const PostulationsTable = ({ searchTerm }) => {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostulations = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('ID de usuario no encontrado');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/postulations/user/${userId}`); // Usar la URL de la API
        setPostulations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las postulaciones');
        setLoading(false);
      }
    };

    fetchPostulations();
  }, []);

  if (loading) {
    return <div>Cargando postulaciones...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filtrado de postulaciones
  const filteredPostulations = postulations.filter(p => 
    p.projectId && p.projectId.name && p.projectId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ padding: 2, textAlign: 'center' }}>
        Tus Postulaciones
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center"><strong>Proyecto</strong></TableCell>
            <TableCell align="center"><strong>Estado</strong></TableCell>
            <TableCell align="center"><strong>Acciones</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPostulations.map((p) => (
            <TableRow key={p._id} className="hover:bg-gray-100">
              <TableCell align="center">{p.projectId ? p.projectId.name : 'Sin nombre'}</TableCell>
              <TableCell align="center">{p.status}</TableCell>
              <TableCell align="center">
                {p.status.toLowerCase() === 'aceptado' && (
                  <Link to={`/taskview/${p.projectId._id}`}>
                    <Button variant="contained" color="primary">
                      Ver Proyecto
                    </Button>
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostulationsTable;
