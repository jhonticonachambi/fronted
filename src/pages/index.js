import React from 'react';
import '../assets/styles/index.css';
import voluntariadoComunitario from '../assets/img/Voluntariado-Comunitario.jpg';
import voluntariadoAmbiental from '../assets/img/Voluntariado-Ambiental.jpg';
import voluntariadoDeportivo from '../assets/img/Voluntariado-deportivo_1.jpg';

export default function Home() {
  return (
    <div id="root" className="min-h-screen flex flex-col">
      {/* Contenedor Principal */}
      <div className="flex-grow">
        {/* Barra de Navegación */}
        <nav className="bg-blue-800 text-white py-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            
            <div className="text-2xl font-bold"> Voluntariado</div>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:text-blue-300">Inicio</a></li>
              <li><a href="/register" className="hover:text-blue-300">Registro</a></li>
              <li><a href="/login" className="hover:text-blue-300">Iniciar Sesión</a></li>
            </ul>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="bg-blue-600 text-white py-24">
          <div className="container mx-auto flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold mb-4">Únete a Nuestro Proyecto de Voluntariado</h1>
            <p className="text-lg mb-8 text-white">Haz la diferencia y contribuye al bienestar de la comunidad con tu tiempo y esfuerzo.</p>
            <a href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300">
              ¡Regístrate Ahora!
            </a>
          </div>
        </header>

        {/* Sección: Qué es la plataforma */}
        <section className="py-16 bg-gray-100 text-center">
          <h2 className="text-4xl font-semibold mb-6">¿Qué es la Plataforma de Voluntariado?</h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            La Plataforma de Voluntariado es un espacio diseñado para conectar personas como tú, que desean hacer una diferencia en el mundo, con organizaciones y proyectos que necesitan tu ayuda. Ya sea en áreas de educación, salud, medio ambiente o asistencia social, siempre hay una oportunidad para que contribuyas.
          </p>
        </section>

        {/* Sección: Beneficios de ser voluntario */}
        <section className="py-16 bg-white text-center">
          <h2 className="text-4xl font-semibold mb-12">Beneficios de ser Voluntario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-24">
            <div className="bg-blue-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Impacto Positivo</h3>
              <p className="text-gray-700">Contribuirás directamente a mejorar la vida de personas en tu comunidad y más allá.</p>
            </div>
            <div className="bg-blue-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Desarrollo Personal</h3>
              <p className="text-gray-700">Aprenderás nuevas habilidades, harás nuevos amigos y fortalecerás tu capacidad de trabajo en equipo.</p>
            </div>
            <div className="bg-blue-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Reconocimiento</h3>
              <p className="text-gray-700">Tu esfuerzo será reconocido por la comunidad y las organizaciones con las que trabajes.</p>
            </div>
          </div>
        </section>

        {/* Sección: Galería de Proyectos */}
        <section className="py-16 bg-gray-100 text-center">
          <h2 className="text-4xl font-semibold mb-12">Galería de Proyectos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-24">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={voluntariadoComunitario} alt="Proyecto Comunitario" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Voluntariado Comunitario</h3>
                <p className="text-gray-700">Descripción del Proyecto Comunitario</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={voluntariadoAmbiental} alt="Proyecto Ambiental" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Voluntariado Ambiental</h3>
                <p className="text-gray-700">Descripción del Proyecto Ambiental</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={voluntariadoDeportivo} alt="Proyecto Deportivo" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">Voluntariado Deportivo</h3>
                <p className="text-gray-700">Descripción del Proyecto Deportivo</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Pie de página simple con un div */}
      <div className="bg-blue-800 text-white py-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold">Contacto</h3>
            <p className="text-gray-300">Teléfono: +51 980 254 561</p>
            <p className="text-gray-300">Email: info@voluntariado.org</p>
          </div>
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold">Enlaces Rápidos</h3>
            <ul className="text-gray-300 space-y-2">
              <li><a href="/about" className="hover:text-white">Sobre Nosotros</a></li>
              <li><a href="/projects" className="hover:text-white">Proyectos</a></li>
              <li><a href="/contact" className="hover:text-white">Contáctanos</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Síguenos</h3>
            <div className="flex space-x-4 mt-2">
              {/* Aquí puedes agregar iconos o enlaces a redes sociales */}
            </div>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-6">
          <p>© 2024 Plataforma de Voluntariado | Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}
