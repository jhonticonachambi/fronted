// components/ui/StatusPill.js
import React from 'react';
import PropTypes from 'prop-types';

const variantClasses = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800'
};

const StatusPill = ({ status, variant = 'neutral' }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {status}
    </span>
  );
};

StatusPill.propTypes = {
  status: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'neutral'])
};

export default StatusPill;