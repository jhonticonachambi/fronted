import React, { useEffect, useState } from 'react';

// Datos simulados (podrías obtenerlos desde tu backend)
const mockVolunteers = [
  { id: 1, name: 'Carlos', skills: ['Desarrollo Web', 'JavaScript'], availability: ['Lunes', 'Miércoles'] },
  { id: 2, name: 'Ana', skills: ['Marketing', 'Diseño Gráfico'], availability: ['Martes', 'Jueves'] },
  { id: 3, name: 'Lucía', skills: ['Desarrollo Web', 'React'], availability: ['Lunes', 'Viernes'] },
];

const projectRequirements = {
  requiredSkills: ['Desarrollo Web', 'React'],
  daysNeeded: ['Lunes', 'Viernes'],
};

const VolunteerRecommendations = () => {
  const [recommendedVolunteers, setRecommendedVolunteers] = useState([]);

  // Función para encontrar coincidencias
  const findMatches = () => {
    const recommendations = mockVolunteers.filter((volunteer) => {
      const skillsMatch = projectRequirements.requiredSkills.every((skill) =>
        volunteer.skills.includes(skill)
      );
      const availabilityMatch = projectRequirements.daysNeeded.some((day) =>
        volunteer.availability.includes(day)
      );
      return skillsMatch && availabilityMatch;
    });
    setRecommendedVolunteers(recommendations);
  };

  useEffect(() => {
    findMatches();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Recomendaciones de Voluntarios</h2>
      <ul>
        {recommendedVolunteers.length > 0 ? (
          recommendedVolunteers.map((volunteer) => (
            <li key={volunteer.id} className="p-2 bg-gray-100 rounded mb-2">
              <p><strong>Nombre:</strong> {volunteer.name}</p>
              <p><strong>Habilidades:</strong> {volunteer.skills.join(', ')}</p>
              <p><strong>Disponibilidad:</strong> {volunteer.availability.join(', ')}</p>
            </li>
          ))
        ) : (
          <p>No se encontraron coincidencias para este proyecto.</p>
        )}
      </ul>
    </div>
  );
};

export default VolunteerRecommendations;
