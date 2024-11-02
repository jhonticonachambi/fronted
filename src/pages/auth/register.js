import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/apiConfig'; // Asegúrate de que la ruta sea correcta

const skillsOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js']; // Opciones de habilidades

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    skills: [],
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (skill) => {
    setFormData(prevState => {
      const skills = prevState.skills.includes(skill)
        ? prevState.skills.filter(s => s !== skill)
        : [...prevState.skills, skill];
      return { ...prevState, skills };
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    // Validar contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/register`, { // Usando API_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData, 
          skills: formData.skills
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Usuario registrado:', data);
        navigate('/login');
      } else {
        console.error('Error en el registro:', data);
        setError(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      setError('Error en el servidor');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Registro de Usuario
        </Typography>
        
        {error && <Typography color="error" align="center">{error}</Typography>}
        
        <TextField
          label="Nombre Completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <TextField
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <TextField
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <TextField
          label="Dirección"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <Box display="flex" alignItems="center">
          <TextField
            label="Contraseña"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Button 
            type="button" 
            onClick={toggleShowPassword} 
            variant="outlined" 
            color="primary" 
            sx={{ ml: 1 }}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </Button>
        </Box>
        
        <TextField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        
        <Typography variant="h7" component="h7" gutterBottom>
          Habilidades (selecciona varias):
        </Typography>
        {skillsOptions.map(skill => (
          <FormControlLabel
            key={skill}
            control={
              <Checkbox
                checked={formData.skills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
                name={skill}
              />
            }
            label={skill}
          />
        ))}
        
        <TextField
          label="Teléfono"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ mt: 2 }}
        >
          Registrarse
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
