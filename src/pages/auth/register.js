import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/apiConfig';

const skillsOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js']; // Opciones de habilidades

const validationSchema = Yup.object({
  name: Yup.string().required('Nombre es requerido'),
  dni: Yup.string()
    .length(8, 'DNI debe tener 8 dígitos')
    .matches(/^\d+$/, 'DNI solo puede contener números')
    .required('DNI es requerido'),
  email: Yup.string().email('Email no es válido').required('Email es requerido'),
  address: Yup.string().required('Dirección es requerida'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número')
    .matches(/[\W_]/, 'Debe contener al menos un carácter especial')
    .required('Contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Confirmación de contraseña es requerida'),
  phone: Yup.string()
    .length(9, 'Teléfono debe tener 9 dígitos')
    .matches(/^\d+$/, 'Teléfono solo puede contener números')
    .required('Teléfono es requerido'),
  skills: Yup.array().min(1, 'Selecciona al menos una habilidad')
});

const Register = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: '',
      dni: '',
      email: '',
      address: '',
      password: '',
      confirmPassword: '',
      skills: [],
      phone: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Usuario registrado:', data);
          navigate('/login');
        } else {
          console.error('Error en el registro:', data);
          formik.setErrors({ general: data.message || 'Error en el registro' });
        }
      } catch (error) {
        console.error('Error en el servidor:', error);
        formik.setErrors({ general: 'Error en el servidor' });
      }
    }
  });

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
        onSubmit={formik.handleSubmit}
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
        
        {formik.errors.general && <Typography color="error" align="center">{formik.errors.general}</Typography>}
        
        <TextField
          label="Nombre Completo"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          fullWidth
          required
          margin="normal"
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        
        <TextField
          label="DNI"
          name="dni"
          value={formik.values.dni}
          onChange={formik.handleChange}
          fullWidth
          required
          margin="normal"
          error={formik.touched.dni && Boolean(formik.errors.dni)}
          helperText={formik.touched.dni && formik.errors.dni}
          inputProps={{ maxLength: 8 }}
        />
        
        <TextField
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          fullWidth
          required
          margin="normal"
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        
        <TextField
          label="Dirección"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          fullWidth
          required
          margin="normal"
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        
        <Box display="flex" alignItems="center">
          <TextField
            label="Contraseña"
            name="password"
            type={formik.values.showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            fullWidth
            required
            margin="normal"
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button 
            type="button" 
            onClick={() => formik.setFieldValue('showPassword', !formik.values.showPassword)} 
            variant="outlined" 
            color="primary" 
            sx={{ ml: 1 }}
          >
            {formik.values.showPassword ? 'Ocultar' : 'Mostrar'}
          </Button>
        </Box>
        
        <TextField
          label="Confirmar Contraseña"
          name="confirmPassword"
          type={formik.values.showPassword ? 'text' : 'password'}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          fullWidth
          required
          margin="normal"
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        
        <Typography variant="h7" component="h7" gutterBottom>
          Habilidades (selecciona varias):
        </Typography>
        {skillsOptions.map(skill => (
          <FormControlLabel
            key={skill}
            control={
              <Checkbox
                checked={formik.values.skills.includes(skill)}
                onChange={() => {
                  const newSkills = formik.values.skills.includes(skill)
                    ? formik.values.skills.filter(s => s !== skill)
                    : [...formik.values.skills, skill];
                  formik.setFieldValue('skills', newSkills);
                }}
                name={skill}
              />
            }
            label={skill}
          />
        ))}
        {formik.touched.skills && formik.errors.skills && (
          <Typography color="error" variant="caption">{formik.errors.skills}</Typography>
        )}
        
        <TextField
          label="Teléfono"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          fullWidth
          required
          margin="normal"
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          inputProps={{ maxLength: 9 }}
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
