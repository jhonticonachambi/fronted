import React from 'react';
import PropTypes from 'prop-types';

const statusColors = {
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-purple-100 text-purple-800',
  rejected: 'bg-gray-100 text-gray-800',
  default: 'bg-gray-100 text-gray-800'
};

const StatusBadge = ({ status, children }) => {
  const colorClass = statusColors[status] || statusColors.default;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {children || status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default StatusBadge; 