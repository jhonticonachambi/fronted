import React from 'react';

const PostulationsTable = ({ postulations, selectedPostulations, handleCheckboxChange, fetchUserProfile }) => (
  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4">
    <thead className="bg-gray-200">
      <tr>
        <th className="py-2 px-4">Seleccionar</th>
        <th className="py-2 px-4">Nombre</th>
        <th className="py-2 px-4">Email</th>
        <th className="py-2 px-4">Estado</th>
        <th className="py-2 px-4">Ver Perfil</th>
      </tr>
    </thead>
    <tbody>
      {postulations.map((postulation) => {
        const isAccepted = postulation.status.toLowerCase() === 'accepted';
        return (
          <tr key={postulation._id} className={`border-t ${isAccepted ? 'bg-green-50' : ''}`}>
            <td className="py-2 px-4">
              <input
                type="checkbox"
                checked={selectedPostulations.includes(postulation._id)}
                onChange={() => handleCheckboxChange(postulation._id)}
                disabled={isAccepted}
                className={isAccepted ? 'cursor-not-allowed opacity-50' : ''}
                title={isAccepted ? 'Esta postulación ya ha sido aceptada' : ''}
              />
            </td>
            <td className="py-2 px-4">{postulation.userId.name}</td>
            <td className="py-2 px-4">{postulation.userId.email}</td>
            <td className="py-2 px-4">
              <span className={`px-2 py-1 rounded-full text-xs ${
                isAccepted ? 'bg-green-100 text-green-800' : 
                postulation.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {postulation.status}
              </span>
            </td>
            <td className="py-2 px-4">
              <button
                onClick={() => fetchUserProfile(postulation.userId._id)}
                className="text-blue-500 hover:underline"
              >
                Ver Perfil
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default PostulationsTable;
