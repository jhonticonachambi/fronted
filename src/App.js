// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Pagina Principal
import Home from './pages/index';
// Pagina de Autenticacion

import Login from './pages/auth/login';       
import Register from './pages/auth/register';
// Pagina de Usuario Voluntario
import Platform from './pages/user/platform'; 
import Projects from './pages/user/projects'; 
import Postulation from './pages/user/postulation';
// Pagina de Usuario Admin
import Profile from './pages/user/profile';   
import Dashboard from './pages/admin/dashboard'; 
import ProjectManagement from './pages/admin/ProjectManagement';
import ProjectDetails from './pages/admin/ProjectDetails';
import CreateProject from './pages/admin/CreateProject';
import VolunteerRecommendations from './pages/admin/recommendations';

import ReportManagement from './pages/admin/reportManagement';
import ReportView from './pages/admin/reportView';
import Task from './pages/admin/TaskManagement';

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
        <Route path="/platform" element={<UserLayout><Platform /></UserLayout>} />
        <Route path="/projects" element={<UserLayout><Projects /></UserLayout>} />
        <Route path="/projects/postulation/:projectId" element={<UserLayout><Postulation /></UserLayout>} />
        {/* <Route path="/postulation/:projectName" element={<UserLayout><Postulation /></UserLayout>} /> */}
        <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />

        {/* Layout de Admin */}
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/project-management" element={<AdminLayout><ProjectManagement /></AdminLayout>} /> 
        <Route path="/admin/create-project" element={<AdminLayout><CreateProject /></AdminLayout>} /> {/* Ruta añadida para crear proyectos */}
        <Route path="/recommendations" element={<AdminLayout><VolunteerRecommendations /></AdminLayout>} />

        <Route path="/report" element={<AdminLayout><ReportManagement /></AdminLayout>} />
        <Route path="/report/:id" element={<AdminLayout><ReportView /></AdminLayout>} />

        <Route path="/TaskManagement" element={<AdminLayout><Task /></AdminLayout>} />

        
        <Route path="/project/:id" element={<AdminLayout><ProjectDetails /></AdminLayout>} /> 


        {/* Página de Inicio */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;