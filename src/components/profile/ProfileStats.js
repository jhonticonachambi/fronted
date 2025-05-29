// import React from 'react';
// import { Box, Typography } from '@mui/material';

// const ProfileStats = ({ profile }) => {
//   if (!profile) {
//     return null;
//   }
//   // Componente para tarjetas de estadísticas
//   const StatCard = ({ title, children }) => (
//     <Box>
//       <Typography variant="h6">
//         {title}
//       </Typography>
//       {children}
//     </Box>
//   );
//   // Componente para elemento individual de estadística
//   const StatItem = ({ label, value }) => (
//     <Box>
//       <Typography variant="body2">{label}</Typography>
//       <Typography variant="h6">{value}</Typography>
//     </Box>
//   );
//   return (
//     <Box>
//       <Box>
//         {/* Tarjeta de estadísticas generales */}
//         <StatCard title="Estadísticas">
//           <Box>
//             <StatItem label="Proyectos Totales" value={profile.totalProjects} />
//             <StatItem label="Proyectos Completados" value={profile.completedProjects} />
//             <StatItem label="Horas Totales" value={profile.totalHours} />
//             <StatItem label="Horas Disponibles" value={profile.availabilityHours} />
//           </Box>
//         </StatCard>

//         {/* Tarjeta de evaluaciones */}
//         <StatCard title="Evaluaciones">
//           <Box>
//             <StatItem label="Confiabilidad" value={`${profile.reliability}/5`} />
//             <StatItem label="Puntualidad" value={`${profile.punctuality}/5`} />
//             <StatItem label="Calidad de Tareas" value={`${profile.taskQuality}/5`} />
//             <StatItem label="Tasa de Éxito" value={`${profile.successRate}%`} />
//           </Box>
//         </StatCard>
//       </Box>      {/* Tarjeta de información adicional */}
//       <Box>
//         <Typography variant="h6">
//           Información Adicional
//         </Typography>
//         <Box>
//           <Box>
//             <Typography variant="body2">ID de Perfil</Typography>
//             <Typography variant="body2">{profile._id}</Typography>
//           </Box>
//           <Box>
//             <Typography variant="body2">Última Actividad</Typography>
//             <Typography variant="body2">{new Date(profile.lastActive).toLocaleString()}</Typography>
//           </Box>
//           <Box>
//             <Typography variant="body2">Creado</Typography>
//             <Typography variant="body2">{new Date(profile.createdAt).toLocaleString()}</Typography>
//           </Box>
//           <Box>
//             <Typography variant="body2">Actualizado</Typography>
//             <Typography variant="body2">{new Date(profile.updatedAt).toLocaleString()}</Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ProfileStats;






















import React from 'react';
import { Box, Typography, Paper, Divider, Checkbox, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const ProfileStats = ({ profile }) => {
  if (!profile) {
    return null;
  }

  // Componente para tarjetas de estadísticas
  const StatCard = ({ title, children }) => (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  // Componente para elemento individual de estadística con checkbox
  const StatItem = ({ label, value, checked = false }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      <Checkbox
        icon={<RadioButtonUncheckedIcon />}
        checkedIcon={<CheckCircleIcon color="primary" />}
        checked={checked}
        sx={{ p: 0, mr: 1 }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  // Componente para rating con iconos
  const RatingItem = ({ label, value, max = 5, checked = false }) => {
    const filledIcons = Array.from({ length: value }, (_, i) => (
      <span key={`filled-${i}`} style={{ color: '#4caf50' }}>✓</span>
    ));
    const emptyIcons = Array.from({ length: max - value }, (_, i) => (
      <span key={`empty-${i}`} style={{ color: '#e0e0e0' }}>✓</span>
    ));

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Checkbox
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon color="primary" />}
          checked={checked}
          sx={{ p: 0, mr: 1 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            {label}
          </Typography>
          <Box>
            {filledIcons}{emptyIcons} <span style={{ marginLeft: '8px' }}>{value}/{max}</span>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Encabezado del perfil */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2, background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
          {profile.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
          {profile.email}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '16px', mr: 1 }} />
          <Typography variant="body2" sx={{ color: 'white' }}>
            Voluntario Activo
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Tarjeta de estadísticas generales */}
          <StatCard title="Estadísticas de Proyectos">
            <StatItem 
              label="Proyectos Totales" 
              value={profile.totalProjects} 
              checked={false}
            />
            <StatItem 
              label="Proyectos Completados" 
              value={profile.completedProjects} 
              checked={false}
            />
            <StatItem 
              label="Horas Totales" 
              value={`${profile.totalHours}h`} 
              checked={false}
            />
            <StatItem 
              label="Horas Disponibles" 
              value={`${profile.availabilityHours}h`} 
              checked={true}
            />
          </StatCard>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Tarjeta de evaluaciones */}
          <StatCard title="Evaluaciones">
            <RatingItem 
              label="Confiabilidad" 
              value={profile.reliability} 
              checked={true}
            />
            <RatingItem 
              label="Puntualidad" 
              value={profile.punctuality} 
              checked={false}
            />
            <RatingItem 
              label="Calidad de Tareas" 
              value={profile.taskQuality} 
              checked={false}
            />
            <StatItem 
              label="Tasa de Éxito" 
              value={`${profile.successRate}%`} 
              checked={true}
            />
          </StatCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileStats;