import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

const LoadingSpinner = ({ fullPage }) => {
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'h-screen' : 'h-full'}`}>
      <CircularProgress />
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool
};

LoadingSpinner.defaultProps = {
  fullPage: false
};

export default LoadingSpinner;