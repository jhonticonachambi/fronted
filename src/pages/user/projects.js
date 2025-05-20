import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  LinearProgress, 
  Button, 
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Skeleton,
  Alert,
  Pagination,
  styled
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  VolunteerActivism as VolunteerIcon
} from '@mui/icons-material';
import ProjectCard from '../../components/ProjectCard';
import axios from 'axios';
import API_URL from '../../config/apiConfig';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  background: 'linear-gradient(to bottom, #f8f9ff, #ffffff)'
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2)
  }
}));

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const projectsPerPage = 9;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/projects/active`);
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los proyectos. Por favor intenta nuevamente.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const count = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * projectsPerPage,
    page * projectsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <StyledContainer maxWidth="lg">
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
          startIcon={<VolunteerIcon />}
        >
          Reintentar
        </Button>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <HeaderBox>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 700,
          color: 'primary.dark',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <VolunteerIcon fontSize="large" />
          Proyectos Disponibles
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Buscar proyectos..."
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 4,
                backgroundColor: 'background.paper'
              }
            }}
          />
          <Button 
            variant="outlined" 
            startIcon={<FilterIcon />}
            sx={{ borderRadius: 4 }}
          >
            Filtros
          </Button>
        </Box>
      </HeaderBox>

      {loading ? (
        <Grid container spacing={4}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {filteredProjects.length === 0 ? (
            <Paper elevation={0} sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: 'background.paper'
            }}>
              <Typography variant="h6" gutterBottom>
                No se encontraron proyectos
              </Typography>
              <Typography color="text.secondary" paragraph>
                {searchTerm 
                  ? 'No hay proyectos que coincidan con tu búsqueda.' 
                  : 'Actualmente no hay proyectos disponibles.'}
              </Typography>
              {searchTerm && (
                <Button 
                  variant="text" 
                  color="primary"
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar búsqueda
                </Button>
              )}
            </Paper>
          ) : (
            <>
              <Grid container spacing={4}>
                {paginatedProjects.map((project) => (
                  <Grid item xs={12} sm={6} md={4} key={project._id}>
                    <ProjectCard
                      projectId={project._id}
                      title={project.name}
                      description={project.description}
                      status={project.status || 'activo'}
                      imageSrc={project.bannerImage}
                      organization={project.organization}                      startDate={project.startDate}
                      endDate={project.endDate}
                      volunteersNeeded={project.volunteersNeeded}
                      location={project.location}
                    />
                  </Grid>
                ))}
              </Grid>

              {count > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={count}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </StyledContainer>
  );
};

export default Projects;