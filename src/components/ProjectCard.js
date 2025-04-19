import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip,
  Box,
  Avatar,
  Divider,
  styled
} from '@mui/material';
import { 
  CalendarToday, 
  People, 
  ArrowForward,
  Place
} from '@mui/icons-material';
import { deepPurple, green, orange, grey } from '@mui/material/colors';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  },
  borderRadius: 12,
  overflow: 'hidden'
}));

const StatusChip = styled(Chip)(({ status }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  fontWeight: 600,
  backgroundColor: status === 'activo' 
    ? green[50] 
    : status === 'completado' 
      ? grey[100] 
      : orange[50],
  color: status === 'activo' 
    ? green[800] 
    : status === 'completado' 
      ? grey[600] 
      : orange[800],
  border: `1px solid ${status === 'activo' 
    ? green[100] 
    : status === 'completado' 
      ? grey[300] 
      : orange[100]}`,
  zIndex: 1
}));

const ProjectCard = ({ 
  title, 
  description, 
  status, 
  imageSrc, 
  projectId, 
  organization,
  startDate,
  volunteersNeeded,
  location
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/postulacion/${projectId}`);
  };

  return (
    <StyledCard elevation={4}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={imageSrc || '/default-project.jpg'}
          alt={title}
        />
        <StatusChip 
          status={status} 
          label={status === 'activo' ? 'Activo' : status === 'completado' ? 'Completado' : 'Pendiente'} 
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              mr: 1,
              bgcolor: deepPurple[500],
              fontSize: 14
            }}
          >
            {organization?.charAt(0) || 'O'}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {organization || 'Organización'}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph sx={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1 }}>
          {startDate && (
            <Chip
              icon={<CalendarToday fontSize="small" />}
              label={new Date(startDate).toLocaleDateString()}
              size="small"
              variant="outlined"
            />
          )}
          {volunteersNeeded && (
            <Chip
              icon={<People fontSize="small" />}
              label={`${volunteersNeeded} voluntarios`}
              size="small"
              variant="outlined"
            />
          )}
          {location && (
            <Chip
              icon={<Place fontSize="small" />}
              label={location}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          endIcon={<ArrowForward />}
          onClick={handleCardClick}
          sx={{
            borderRadius: 2,
            py: 1,
            fontWeight: 600
          }}
        >
          Ver Detalles
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default ProjectCard;