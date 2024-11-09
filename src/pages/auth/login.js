import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import voluntariadoIcon from '../../assets/img/icon/voluntario.png';
import API_URL from '../../config/apiConfig'; // Asegúrate de que la ruta sea correcta

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { // Usando API_URL
        email,
        password,
      });

      // Guardar token, nombre y rol del usuario en localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.name); // Almacena el nombre del usuario
      localStorage.setItem("role", res.data.role); // Almacena el rol del usuario
      localStorage.setItem("userId", res.data.id);

      // Redirigir según el rol del usuario
      if (res.data.role === "admin") {
        navigate("/dashboard"); // Redirige al dashboard si es admin
      } else {
        navigate("/plataforma"); // Redirige a la plataforma si es voluntario
      }
    } catch (err) {
      setError("Error al iniciar sesión, revisa tus credenciales.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img
            src={voluntariadoIcon}
            alt="Logo"
            className="w-24 h-24"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Ingresa tu correo"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Entrar
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/" className="text-blue-500 hover:underline">
            ¿Olvidaste tu contraseña? Recupérala aquí
          </a>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300">
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
