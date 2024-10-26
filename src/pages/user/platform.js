import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import PostulationsTable from '../../components/PostulationsTable';


const Platform = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); // Obtén el nombre de usuario

    if (!token) {
      // Si no hay token, redirige al login
      navigate('/login');
    } else {
      setUsername(storedUsername); // Establece el nombre del usuario en el estado
    }
  }, [navigate]);
/*
  const handleLogout = () => {
    localStorage.removeItem('token');  // Eliminar el token del almacenamiento local
    localStorage.removeItem('username'); // También elimina el nombre de usuario
    navigate('/login'); // Redirige al login
  };*/

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800">Bienvenido, {username}</h2>
        
        {/* Search Bar */}
        <div className="mb-8 flex justify-center items-center">
          <SearchBar />
        </div>

        
        {/* Postulations Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <PostulationsTable />
        </div>
      </div>

    </div>
  );
};

export default Platform;
