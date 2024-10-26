import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los headers
          },
        });
        console.log(response.data); // <-- Aquí puedes ver los datos del usuario en la consola
        setUser(response.data); // Guardar los datos del usuario en el estado
        setLoading(false); // Desactivar la carga
      } catch (err) {
        setError('Error al cargar el perfil del usuario'); // Manejar errores
        setLoading(false); // Desactivar la carga en caso de error
      }
    };
  
    fetchUserProfile(); // Llamar a la función para obtener los datos del perfil
  }, []);
  

  // Si los datos están cargando, mostrar un indicador de carga
  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Cargando perfil del usuario...</div>;
  }

  // Si hay un error, mostrar el mensaje de error
  if (error) {
    return <div className="text-center mt-10 text-red-500 text-xl">{error}</div>;
  }

  // Si los datos se cargaron correctamente, mostrar los detalles del usuario
  if (user) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center">
        

        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl overflow-hidden">
          <div className="bg-blue-600 p-6 flex items-center justify-between">
            {/* Sección de foto y nombre */}
            <div className="flex items-center">
              <img
                className="w-24 h-24 rounded-full border-4 border-white"
                src="https://via.placeholder.com/150" // Foto de perfil de ejemplo
                alt="Profile"
              />
              <div className="ml-4 text-white">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-200">{user.email}</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-100">
              Cambiar Foto
            </button>
          </div>

          {/* Detalles del usuario */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4">Detalles de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  value={user.name}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={user.email}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={user.phone}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700">Dirección</label>
                <input
                  type="text"
                  value={user.address}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700">Habilidades</label>
                <input
                  type="text"
                  value={user.skills.join(', ')}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-gray-700">Rol</label>
                <input
                  type="text"
                  value={user.role === 'volunteer' ? 'Voluntario' : 'Administrador'}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>
            </div>

            <div className="mt-6 text-right">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
                Actualizar Información
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // Devolver null si no hay datos
};

export default Profile;
