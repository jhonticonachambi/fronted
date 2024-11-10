import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, Avatar, Chip } from '@mui/material';
import { FaCheckCircle, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'; // Importa iconos de Font Awesome
import axios from 'axios';
import API_URL from '../../../config/apiConfig'; // Ajusta la ruta según tu estructura

// Datos simulados (puedes obtenerlos desde tu backend)
const mockVolunteers = [
  { id: 1, name: 'Carlos', skills: ['Desarrollo Web', 'JavaScript'], availability: ['Lunes', 'Miércoles'] },
  { id: 2, name: 'Ana', skills: ['Marketing', 'Diseño Gráfico'], availability: ['Martes', 'Jueves'] },
  { id: 3, name: 'Lucía', skills: ['Desarrollo Web', 'React'], availability: ['Lunes', 'Viernes'] },
];

const projectRequirements = {
  requiredSkills: ['Desarrollo Web', 'React'],
  daysNeeded: ['Lunes', 'Viernes'],
};

const VolunteerRecommendations = () => {
  const [recommendedVolunteers, setRecommendedVolunteers] = useState([]);

  // Función para encontrar coincidencias
  const findMatches = () => {
    const recommendations = mockVolunteers.filter((volunteer) => {
      const skillsMatch = projectRequirements.requiredSkills.every((skill) =>
        volunteer.skills.includes(skill)
      );
      const availabilityMatch = projectRequirements.daysNeeded.some((day) =>
        volunteer.availability.includes(day)
      );
      return skillsMatch && availabilityMatch;
    });
    setRecommendedVolunteers(recommendations);
  };

  useEffect(() => {
    findMatches();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Recomendaciones de Voluntarios</Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Basado en los requisitos del proyecto, aquí tienes a los voluntarios que cumplen con las habilidades y disponibilidad necesarias.
      </Typography>

      <Grid container spacing={4}>
        {recommendedVolunteers.length > 0 ? (
          recommendedVolunteers.map((volunteer) => (
            <Grid item xs={12} sm={6} md={4} key={volunteer.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>
                        {volunteer.name.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">{volunteer.name}</Typography>
                      <Chip
                        icon={<FaCheckCircle style={{ color: 'green' }} />}
                        label="Recomendado"
                        color="primary"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    <FaBriefcase style={{ color: '#1976d2', marginRight: '8px' }} /> Habilidades
                  </Typography>
                  <div>
                    {volunteer.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        color="secondary"
                        size="small"
                        sx={{ mr: 1, mt: 1 }}
                      />
                    ))}
                  </div>

                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                    <FaCalendarAlt style={{ color: '#1976d2', marginRight: '8px' }} /> Disponibilidad
                  </Typography>
                  <div>
                    {volunteer.availability.map((day, index) => (
                      <Chip
                        key={index}
                        label={day}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mt: 1 }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No se encontraron coincidencias para este proyecto.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default VolunteerRecommendations;
