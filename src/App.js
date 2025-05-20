import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Estilos
import './assets/styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
// Importación de Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Importación de páginas
import Home from './pages/index';
// Importación de páginas Autenticaciones
import Login from './pages/auth/login';       
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import AuthCallback from './pages/auth/AuthCallback';
// Importación de páginas Usuarios
import Platform from './pages/user/platform'; 
import Projects from './pages/user/projects'; 
import Postulation from './pages/user/postulation';
import Profile from './pages/user/profile';   
import TaskViews from './pages/user/taskview';   
import Notification from './pages/user/notification';   
// Importacion de Admin
import Dashboard from './pages/admin/dashboard'; 
// Proyectos
import ProjectManagement from './pages/admin/project/ProjectManagement';
import ProjectDetails from './pages/admin/project/ProjectDetails';
import CreateProject from './pages/admin/project/CreateProject';
import EditProject from './pages/admin/project/EditProject';
import ProjectView from './pages/admin/project/ProjectView';
// Recomendaciones
import VolunteerRecommendations from './pages/admin/recommendations/recommendations';
// Reportes
import ReportManagement from './pages/admin/report/reportManagement';
import ProjectReport from './pages/admin/report/ProjectReport';
// Tareas
import Task from './pages/admin/task/TaskManagement';
import AddTask from './pages/admin/task/AddTask';
import EditTask from './pages/admin/task/EditTask';
//Postulaciones
import PostulationDetail from './pages/admin/postulation/PostulationDetail';
import PostulationManagement from './pages/admin/postulation/PostulationManagement';


function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas sin layout (auth) */}        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/auth-callback" element={<AuthCallback />} />

        {/* Layout de Usuario */}
        <Route path="/plataforma" element={<UserLayout><Platform /></UserLayout>} />
        <Route path="/lista-proyectos" element={<UserLayout><Projects /></UserLayout>} />
        <Route path="/postulacion/:projectId" element={<UserLayout><Postulation /></UserLayout>} />
        <Route path="/perfil" element={<UserLayout><Profile /></UserLayout>} />
        <Route path="/taskview/:id" element={<UserLayout><TaskViews /></UserLayout>} />
        <Route path="/Notification" element={<UserLayout><Notification /></UserLayout>} />

        {/* Layout de Admin */}
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        {/* Proyecto */}
        <Route path="/gestion-de-proyectos" element={<AdminLayout><ProjectManagement /></AdminLayout>} /> 
        <Route path="/crear-proyecto" element={<AdminLayout><CreateProject /></AdminLayout>} /> 
        <Route path="/proyecto/:id" element={<AdminLayout><ProjectDetails /></AdminLayout>} />
        <Route path="/proyecto/ver/:id" element={<AdminLayout><ProjectView /></AdminLayout>} />
        <Route path="/proyecto/editar/:id" element={<AdminLayout><EditProject /></AdminLayout>} />
        {/* Postulacion */}
        <Route path="/gestion-de-postulacion" element={<AdminLayout><PostulationManagement /></AdminLayout>} />
        <Route path="/postulacion/asignar-voluntarios/:id" element={<AdminLayout><PostulationDetail /></AdminLayout>} />
        {/* Reportes */}
        <Route path="/gestion-de-reportes" element={<AdminLayout><ReportManagement /></AdminLayout>} />
        <Route path="/reporte/:id" element={<AdminLayout><ProjectReport /></AdminLayout>} />
        {/* Tareas */}
        <Route path="/gestion-de-tareas" element={<AdminLayout><Task /></AdminLayout>} />
        <Route path="/Agregar-Tarea" element={<AdminLayout><AddTask /></AdminLayout>} />
        <Route path="/Editar-Tarea/:taskId" element={<AdminLayout><EditTask /></AdminLayout>} />
        {/* Recomendaciones */}
        <Route path="/recomendaciones" element={<AdminLayout><VolunteerRecommendations /></AdminLayout>} />
        {/* Página de Inicio */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
