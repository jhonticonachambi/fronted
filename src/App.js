import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 

// Importación de páginas
import Home from './pages/index';
import Login from './pages/auth/login';       
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';


import Platform from './pages/user/platform'; 
import Projects from './pages/user/projects'; 
import Postulation from './pages/user/postulation';
import Profile from './pages/user/profile';   
import TaskViews from './pages/user/taskview';   
import Notification from './pages/user/notification';   


import Dashboard from './pages/admin/dashboard'; 
import ProjectManagement from './pages/admin/project/ProjectManagement';
import ProjectDetails from './pages/admin/project/ProjectDetails';
import CreateProject from './pages/admin/project/CreateProject';
import VolunteerRecommendations from './pages/admin/recommendations/recommendations';
import ReportManagement from './pages/admin/report/reportManagement';
import ProjectReport from './pages/admin/report/ProjectReport';

import Task from './pages/admin/task/TaskManagement';
import AddTask from './pages/admin/task/AddTask';
import EditTask from './pages/admin/task/EditTask';

// Importación de Layouts
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Layout de Usuario */}
        <Route path="/plataforma" element={<UserLayout><Platform /></UserLayout>} />
        <Route path="/lista-proyectos" element={<UserLayout><Projects /></UserLayout>} />
        <Route path="/postulacion/:projectId" element={<UserLayout><Postulation /></UserLayout>} />
        <Route path="/perfil" element={<UserLayout><Profile /></UserLayout>} />
        <Route path="/taskview/:id" element={<UserLayout><TaskViews /></UserLayout>} />
        <Route path="/Notification" element={<UserLayout><Notification /></UserLayout>} />

        {/* Layout de Admin */}
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/gestion-de-proyectos" element={<AdminLayout><ProjectManagement /></AdminLayout>} /> 
        <Route path="/crear-proyecto" element={<AdminLayout><CreateProject /></AdminLayout>} /> 
        <Route path="/recomendaciones" element={<AdminLayout><VolunteerRecommendations /></AdminLayout>} />
        <Route path="/reportes-por-proyectos" element={<AdminLayout><ReportManagement /></AdminLayout>} />

        <Route path="/reporte/:id" element={<AdminLayout><ProjectReport /></AdminLayout>} />
        
        <Route path="/Tareas" element={<AdminLayout><Task /></AdminLayout>} />
        <Route path="/Agregar-Tarea" element={<AdminLayout><AddTask /></AdminLayout>} />
        <Route path="/Editar-Tarea/:taskId" element={<AdminLayout><EditTask /></AdminLayout>} />



        <Route path="/proyecto/:id" element={<AdminLayout><ProjectDetails /></AdminLayout>} />

        {/* Página de Inicio */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
