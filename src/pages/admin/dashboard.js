import React from 'react';


const Dashboard = () => {
  return (
    <div >
      
      {/* Contenido principal */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Plataforma de Voluntarios</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Proyectos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards de Proyectos */}
            <div className="bg-white shadow-md rounded p-6">
              <h3 className="text-xl font-bold mb-2">Reforestación en Amazonas</h3>
              <p>Reforestación de áreas afectadas por la deforestación en la región de Amazonas.</p>
              <p className="mt-2 text-gray-600">Fecha Límite: 31/12/2024</p>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Ver Detalles</button>
            </div>

            <div className="bg-white shadow-md rounded p-6">
              <h3 className="text-xl font-bold mb-2">Ayuda Comunitaria</h3>
              <p>Clasificación y distribución de alimentos en comunidades vulnerables.</p>
              <p className="mt-2 text-gray-600">Fecha Límite: 30/11/2024</p>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Ver Detalles</button>
            </div>

            <div className="bg-white shadow-md rounded p-6">
              <h3 className="text-xl font-bold mb-2">Construcción de Viviendas</h3>
              <p>Construcción de viviendas para familias en situación de vulnerabilidad.</p>
              <p className="mt-2 text-gray-600">Fecha Límite: 15/10/2024</p>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Ver Detalles</button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">Proyectos Activos</h3>
              <p>3 Proyectos Activos</p>
            </div>
            <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">Voluntarios Asignados</h3>
              <p>9 Voluntarios Asignados</p>
            </div>
            <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">Proyectos Completados</h3>
              <p>2 Proyectos Completados</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
