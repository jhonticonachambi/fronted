// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// index.js o App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
// Pagina Principal
import Home from './pages/index';

// Pagina de Autenticacion
import Login from './pages/auth/login';       
import Register from './pages/auth/register';

// Pagina de Usuario Voluntario
import Platform from './pages/user/platform'; 
import Projects from './pages/user/projects'; 
import Postulation from './pages/user/postulation';
import Profile from './pages/user/profile';   

// Pagina de Usuario Admin
import Dashboard from './pages/admin/dashboard'; 
import ProjectManagement from './pages/admin/project/ProjectManagement';
import ProjectDetails from './pages/admin/project/ProjectDetails';
import CreateProject from './pages/admin/project/CreateProject';
import VolunteerRecommendations from './pages/admin/recommendations/recommendations';
import ReportManagement from './pages/admin/report/reportManagement';
import ReportView from './pages/admin/report/reportView';
import Task from './pages/admin/task/TaskManagement';

// Pagina de Layout
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import './assets/styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas sin layout (auth) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout de Usuario */}
        <Route path="/plataforma" element={<UserLayout><Platform /></UserLayout>} />
        <Route path="/lista-proyectos" element={<UserLayout><Projects /></UserLayout>} />
        <Route path="/postulacion/:projectId" element={<UserLayout><Postulation /></UserLayout>} />
        <Route path="/perfil" element={<UserLayout><Profile /></UserLayout>} />

        {/* Layout de Admin */}
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/gestion-de-proyectos" element={<AdminLayout><ProjectManagement /></AdminLayout>} /> 
        <Route path="/crear-proyecto" element={<AdminLayout><CreateProject /></AdminLayout>} /> {/* Ruta añadida para crear proyectos */}
        <Route path="/recomendaciones" element={<AdminLayout><VolunteerRecommendations /></AdminLayout>} />
        <Route path="/reportes-por-proyectos" element={<AdminLayout><ReportManagement /></AdminLayout>} />
        <Route path="/reporte/:id" element={<AdminLayout><ReportView /></AdminLayout>} />
        <Route path="/Tareas" element={<AdminLayout><Task /></AdminLayout>} />
        <Route path="/proyecto/:id" element={<AdminLayout><ProjectDetails /></AdminLayout>} /> 


        {/* Página de Inicio */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;