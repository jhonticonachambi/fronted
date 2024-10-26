// components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header>
      <h2>Voluntariado</h2>
      <nav>
        <ul>
          <li><Link to="/platform">Inicio</Link></li>
          <li><Link to="/projects">Proyectos</Link></li>
          <li><Link to="/profile">Perfil</Link></li>
          <li>
            <button onClick={handleLogout} style={{ color: 'red' }}>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
