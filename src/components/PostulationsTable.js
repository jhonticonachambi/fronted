import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Paper, 
  Typography,
  LinearProgress,
  Chip,
  Tooltip,
  IconButton,
  Box,
  Skeleton
} from '@mui/material';
import { 
  CheckCircle, 
  Pending, 
  Cancel, 
  Visibility, 
  Refresh 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import API_URL from '../config/apiConfig';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StatusChip = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'accepted':
      return (
        <Chip 
          icon={<CheckCircle fontSize="small" />} 
          label="Aceptado" 
          color="success" 
          variant="outlined"
        />
      );
    case 'pending':
      return (
        <Chip 
          icon={<Pending fontSize="small" />} 
          label="Pendiente" 
          color="warning" 
          variant="outlined"
        />
      );
    case 'rejected':
      return (
        <Chip 
          icon={<Cancel fontSize="small" />} 
          label="Rechazado" 
          color="error" 
          variant="outlined"
        />
      );
    default:
      return <Chip label={status} variant="outlined" />;
  }
};

const PostulationsTable = ({ searchTerm }) => {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPostulations = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('ID de usuario no encontrado');
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);
      const response = await axios.get(`${API_URL}/postulations/user/${userId}`);
      setPostulations(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las postulaciones. Intenta nuevamente.');
      console.error('Error fetching postulations:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPostulations();
  }, []);

  const filteredPostulations = postulations.filter(p => 
    p.projectId && p.projectId.name && 
    p.projectId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={fetchPostulations}
          disabled={refreshing}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  if (filteredPostulations.length === 0) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" gutterBottom>
          No hay postulaciones para mostrar
        </Typography>
        <Typography color="text.secondary" paragraph>
          {searchTerm ? 
            'No se encontraron postulaciones que coincidan con tu búsqueda.' : 
            'Aún no has aplicado a ningún proyecto de voluntariado.'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          to="/projects"
        >
          Explorar proyectos
        </Button>
      </Box>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Tus Postulaciones
        </Typography>
        <Tooltip title="Actualizar">
          <IconButton 
            onClick={fetchPostulations} 
            disabled={refreshing}
            color="primary"
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      
      {refreshing && <LinearProgress />}
      
      <Table sx={{ minWidth: 650 }} aria-label="tabla de postulaciones">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.default' }}>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Proyecto</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Fecha</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Estado</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPostulations.map((p) => (
            <StyledTableRow key={p._id}>
              <TableCell align="center">
                <Typography fontWeight={500}>
                  {p.projectId ? p.projectId.name : 'Proyecto no disponible'}
                </Typography>
              </TableCell>
              
              
              <TableCell align="center">
                {new Date(p.applicationDate).toLocaleDateString()}
              </TableCell>
              <TableCell align="center">
                <StatusChip status={p.status} />
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="Ver detalles">
                    <Button 
                      variant="outlined" 
                      size="small"
                      component={Link}
                      to={`/postulation/${p._id}`}
                    >
                      <Visibility fontSize="small" sx={{ mr: 0.5 }} /> Detalles
                    </Button>
                  </Tooltip>
                  {p.status.toLowerCase() === 'accepted' && (
                    <Tooltip title="Ir al proyecto">
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        component={Link}
                        to={`/taskview/${p.projectId._id}`}
                      >
                        Unirse
                      </Button>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostulationsTable;