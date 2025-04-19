import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="p-4">
      <Alert severity="error" className="mb-4">
        {message}
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-2 text-sm underline hover:text-blue-700"
          >
            Reintentar
          </button>
        )}
      </Alert>
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func
};

export default ErrorAlert;