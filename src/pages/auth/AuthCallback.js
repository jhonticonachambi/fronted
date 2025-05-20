import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const role = params.get('role');
    const id = params.get('id');

    console.log('Token recibido:', token);
    console.log('Nombre recibido:', name);
    console.log('Rol recibido:', role);
    console.log('ID recibido:', id);

    if (token) {
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', name);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', id);

      // Redirigir según el rol
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/plataforma');
      }
    } else {
      // Si no hay token, redirigir al login
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm text-center">
        <h2 className="text-xl mb-4">Autenticando...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
}

export default AuthCallback;
