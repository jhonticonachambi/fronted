//PAGES/ADMIN/CREATEPROJECT.JS
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirements: '',
    type: '',
    startDate: '',
    endDate: '',
    volunteersRequired: '',
    projectType: '',
    bannerImage: '',
    organizer: '', // Se establecerá automáticamente el ID del organizador
  });

  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(''); // Estado para almacenar el _id del usuario
  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
  const navigate = useNavigate(); // Para redirigir si es necesario

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage

    if (!token) {
      navigate('/login'); // Redirige al login si no hay token
    } else {
      const storedUserId = localStorage.getItem('userId'); // Obtén el _id del usuario
      setUserId(storedUserId); // Establece el _id del usuario en el estado
      setFormData((prevData) => ({
        ...prevData,
        organizer: storedUserId, // Establecer automáticamente el _id del organizador
      }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors and success message
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/projects', formData);
      console.log('Proyecto creado:', response.data);
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Proyecto creado exitosamente.'); 

    } catch (error) {
      console.error('Error al crear el proyecto:', error.response.data);
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors.reduce((acc, curr) => {
          acc[curr.param] = curr.msg;
          return acc;
        }, {}));
      } else {
        setErrors({ general: 'Error en el servidor. Intenta nuevamente.' });
      }
    }
  };

  const handleAccept = () => {
    navigate('/project-management'); // Redirige a Project Management
  };

  return (
    <div className="container mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="list-reset flex text-blue-600">
          <li>
            <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
            <Link to="/project-management" className="text-blue-500 hover:underline">Project Management</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
            <span className="text-gray-600">Nuevo Proyecto</span>
          </li>
        </ol>
      </nav>

      <h2 className="text-2xl mb-4">Crear Proyecto</h2>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {successMessage ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Éxito!</strong>
            <span className="block sm:inline">{successMessage}</span>
            <button
              onClick={handleAccept}
              className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Aceptar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex flex-col mb-4">
                <label className="mb-1 text-lg text-left" htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key.includes('Date') ? 'date' : 'text'}
                  name={key}
                  id={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  readOnly={key === 'organizer'} // Hacer el campo de organizador de solo lectura
                />
                {errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
              </div>
            ))}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">Crear Proyecto</button>
            {errors.general && <span className="text-red-500 text-sm">{errors.general}</span>}
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateProject;