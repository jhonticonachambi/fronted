// import React, { useEffect, useState } from 'react';
// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   CardMedia,
//   Button,
//   Breadcrumbs,
//   Grid,
//   Box,
//   LinearProgress,
//   Chip,
//   Divider,
// } from '@mui/material';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import API_URL from '../../../config/apiConfig';

// // Función para calcular los días restantes hasta la fecha de fin
// const calculateDaysRemaining = (endDate) => {
//   const today = new Date();
//   const end = new Date(endDate);
//   const diffTime = end - today;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convierte el tiempo en días
//   return diffDays >= 0 ? diffDays : 0; // Si el tiempo es negativo, devolvemos 0
// };

// const ReportManagement = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Función para obtener proyectos con detalles adicionales
//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/report/projects-with-details`);
//       setProjects(response.data);
//       setLoading(false); // Detener el loading cuando los proyectos se obtienen
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // Función para manejar la descarga del reporte
//   const handleDownload = async (projectId) => {
//     try {
//       setLoading(true); // Iniciar el loading cuando comienza la descarga

//       const response = await axios.get(`${API_URL}/report/generate-report/${projectId}`, {
//         responseType: 'blob',  // Especificamos que la respuesta será un blob
//       });

//       // Crear un enlace para descargar el archivo
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `reporte-general-${projectId}.pdf`);
//       document.body.appendChild(link);
//       link.click();

//       // Liberar el objeto URL después de la descarga
//       link.parentNode.removeChild(link);

//       setLoading(false); // Detener el loading después de la descarga
//     } catch (error) {
//       console.error('Error al descargar el reporte:', error);
//       setLoading(false);
//     }
//   };

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
//         <Link to="/dashboard" style={{ color: '#1976d2', textDecoration: 'none' }}>
//           Dashboard
//         </Link>
//         <Typography color="text.primary">Gestión de Reportes</Typography>
//       </Breadcrumbs>

//       <Typography variant="h4" sx={{ mb: 4 }}>Gestión de Reportes</Typography>

//       {/* Mostrar el progreso de carga */}
//       {loading && <LinearProgress sx={{ mb: 4 }} />}

//       {/* Grid de tarjetas de proyectos */}
//       <Grid container spacing={4}>
//         {projects.length > 0 ? (
//           projects.map((project) => (
//             <Grid item xs={12} sm={6} md={4} key={project._id}>
//               <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//                 {/* Imagen del proyecto */}
//                 <CardMedia
//                   component="img"
//                   height="180"
//                   image={project.bannerImage || '/default-project-image.jpg'}
//                   alt={project.name}
//                   sx={{ objectFit: 'cover' }}
//                 />
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="h6">{project.name}</Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                     {project.description}
//                   </Typography>

//                   {/* Estado del Proyecto */}
//                   <Box sx={{ mt: 2 }}>
//                     <Chip label={project.status || "Estado desconocido"} color="primary" />
//                   </Box>

//                   {/* Miembros */}
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                     Miembros: {project.members || 0}
//                   </Typography>

//                   {/* Número de tareas y tareas completadas */}
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                     Tareas: {project.tasks || 0} - Completadas: {project.completedTasks || 0}
//                   </Typography>

//                   {/* Días restantes */}
//                   <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                     Días restantes: {project.daysRemaining || 0}
//                   </Typography>

//                 </CardContent>

//                 <Divider sx={{ my: 2 }} />

//                 <Box sx={{ p: 2 }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     sx={{ width: '100%' }}
//                     onClick={() => handleDownload(project._id)} // Llamar a la función de descarga
//                     disabled={loading} // Deshabilitar el botón si se está descargando
//                   >
//                     Descargar Reporte
//                   </Button>
//                 </Box>
//               </Card>
//             </Grid>
//           ))
//         ) : (
//           <Typography variant="body1">No hay proyectos disponibles</Typography>
//         )}
//       </Grid>
//     </Container>
//   );
// };

// export default ReportManagement;












import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../../config/apiConfig';
import './ReportManagement.css'; // Archivo CSS para los estilos

const ReportManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/report/projects-with-details`);
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDownload = async (projectId) => {
    try {
      setDownloading(projectId);
      
      const response = await axios.get(`${API_URL}/report/generate-report/${projectId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-${projectId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
      setDownloading(null);
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
      setDownloading(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completado': return '#4caf50';
      case 'En progreso': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="report-container">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Gestión de Reportes</span>
      </nav>

      <h1 className="page-title">Gestión de Reportes</h1>

      {/* Loading indicator */}
      {loading && <div className="loading-bar"></div>}

      {/* Projects grid */}
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div className="project-card" key={project._id}>
              <img 
                src={project.bannerImage || '/default-project-image.jpg'} 
                alt={project.name} 
                className="project-image"
              />
              
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.name}</h3>
                  <span 
                    className="project-status"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  >
                    {project.status || "Sin estado"}
                  </span>
                </div>

                <p className="project-description" title={project.description}>
                  {project.description || 'Sin descripción'}
                </p>

                <div className="project-stats">
                  <div className="stat-item">
                    <span className="stat-value">{project.members || 0}</span>
                    <span className="stat-label">miembros</span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-value">{project.tasks || 0}</span>
                    <span className="stat-label">tareas</span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: '#4caf50' }}>
                      {project.completedTasks || 0}
                    </span>
                    <span className="stat-label">completadas</span>
                  </div>
                  
                  <div className="stat-item">
                    <span className="stat-value">{project.daysRemaining || 0}</span>
                    <span className="stat-label">días restantes</span>
                  </div>
                </div>
              </div>

              <button
                className={`download-btn ${downloading === project._id ? 'downloading' : ''}`}
                onClick={() => handleDownload(project._id)}
                disabled={loading || downloading === project._id}
              >
                {downloading === project._id ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Descargar Reporte'
                )}
              </button>
            </div>
          ))
        ) : !loading && (
          <div className="empty-state">
            <p>No hay proyectos disponibles</p>
            <p>No se encontraron proyectos para generar reportes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportManagement;