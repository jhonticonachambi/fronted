import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      label="Buscar Proyecto"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Escribe el nombre del proyecto..."
      InputProps={{
        style: { borderBottom: 'none' } // Eliminar la línea de subrayado
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            border: 'none', // Eliminar el borde
          },
          '&:hover fieldset': {
            border: 'none', // Eliminar el borde al pasar el ratón
          },
          '&.Mui-focused fieldset': {
            border: 'none', // Eliminar el borde cuando está enfocado
          },
        },
      }}
    />
  );
};

export default SearchBar;
