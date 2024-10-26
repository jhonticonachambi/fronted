import React, { useState } from 'react';
import '../../assets/styles/Register.css';


const Register = () => {
  const [form, setForm] = useState({
    name: '',
    dni: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    skills: [],
    phoneNumber: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prevForm) => ({
        ...prevForm,
        skills: checked
          ? [...prevForm.skills, value]
          : prevForm.skills.filter((skill) => skill !== value),
      }));
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el registro (por ejemplo, envío de datos al backend)
    console.log('Formulario enviado', form);
  };

  return (
    <div className="register-form-container">
      <h2>Registrarse como Voluntario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre Completo</label>
          <input
            type="text"
            name="name"
            placeholder="Ingresa tu nombre completo"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>DNI</label>
          <input
            type="text"
            name="dni"
            placeholder="Ingresa tu DNI"
            value={form.dni}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="nombre@ejemplo.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input
            type="text"
            name="address"
            placeholder="Ingresa tu dirección"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirma tu contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Habilidades</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Programación (Python, Java, etc.)"
                onChange={handleChange}
              />
              Programación (Python, Java, etc.)
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Soporte Técnico"
                onChange={handleChange}
              />
              Soporte Técnico
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Desarrollo Web"
                onChange={handleChange}
              />
              Desarrollo Web
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Diseño Gráfico"
                onChange={handleChange}
              />
              Diseño Gráfico
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Animador de Eventos"
                onChange={handleChange}
              />
              Animador de Eventos
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Fotografía"
                onChange={handleChange}
              />
              Fotografía
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Organización de Eventos"
                onChange={handleChange}
              />
              Organización de Eventos
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Cuidado de Niños"
                onChange={handleChange}
              />
              Cuidado de Niños
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Marketing Digital"
                onChange={handleChange}
              />
              Marketing Digital
            </label>
            <label>
              <input
                type="checkbox"
                name="skills"
                value="Logística"
                onChange={handleChange}
              />
              Logística
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Número de Teléfono</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Ingresa su número de teléfono"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <a href='/platform' type="submit" className="submit-button">
          Registrar
        </a>
      </form>
    </div>
  );
};

export default Register;
