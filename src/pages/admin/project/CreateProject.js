import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../../../config/apiConfig';
import './CreateProject.css'; // Importamos el archivo CSS personalizado

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
    organizer: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const storedUserId = localStorage.getItem('userId');
      setFormData((prevData) => ({
        ...prevData,
        organizer: storedUserId,
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
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_URL}/projects`, formData);
      setSuccessMessage('Proyecto creado exitosamente.');
      setOpenSnackbar(true);
    } catch (error) {
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

  return (
    <div className="container mt-5">
      {/* Breadcrumbs */}
      <nav className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard" className="text-blue-500 hover:underline">Inicio</Link>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <Link to="/gestion-de-proyectos" className="text-blue-500 hover:underline">Gestión de Proyectos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Nuevo Proyecto
          </li>
        </ol>
      </nav>

      <div className="card">
        <div className="card-header text-start">
          <h2>Crear Proyecto</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="text-start">
            <div className="row g-3">
              {[
                { name: 'name', label: 'Nombre del Proyecto' },
                { name: 'description', label: 'Descripción' },
                { name: 'requirements', label: 'Requerimientos' },
                { name: 'type', label: 'Tipo' },
                { name: 'startDate', label: 'Fecha de Inicio', type: 'date' },
                { name: 'endDate', label: 'Fecha de Fin', type: 'date' },
                { name: 'volunteersRequired', label: 'Voluntarios Requeridos' },
                { name: 'projectType', label: 'Tipo de Proyecto' },
                { name: 'bannerImage', label: 'Imagen del Banner' },
              ].map(({ name, label, type = 'text' }) => (
                <div key={name} className="col-md-6">
                  <label htmlFor={name} className="form-label">
                    {label}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    readOnly={name === 'organizer'}
                    className={`form-control same-width ${errors[name] ? 'is-invalid' : ''}`} // Añadimos una clase personalizada
                  />
                  {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
                </div>
              ))}
            </div>

            <input type="hidden" name="organizer" value={formData.organizer} />

            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                required
              />
              <label className="form-check-label" htmlFor="terms">
                Acepto los términos y condiciones
              </label>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-primary w-100">
                Crear Proyecto
              </button>
            </div>

            {errors.general && <div className="text-danger mt-3">{errors.general}</div>}

            {openSnackbar && (
              <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
                {successMessage}
                <button type="button" className="btn-close" onClick={() => setOpenSnackbar(false)}></button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;


