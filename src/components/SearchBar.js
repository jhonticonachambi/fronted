import React from 'react';

const SearchBar = () => (
  <div className="flex justify-center mt-8 mb-6"> {/* Flex para centrar */}
    <div className="flex items-center w-full max-w-3xl"> {/* El ancho del contenedor sigue siendo 3xl */}
      <input
        type="text"
        placeholder="Buscar proyectos..."
        className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300">
        Buscar
      </button>
    </div>
  </div>
);

export default SearchBar;
