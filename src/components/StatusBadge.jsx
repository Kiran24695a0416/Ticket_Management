import React from 'react';

export const StatusBadge = ({ status }) => {
  const formattedStatus = status ? status.toLowerCase() : 'open';
  const displayLabel = status ? status.replace('_', ' ') : 'OPEN';

  return (
    <span className={`badge badge-status-${formattedStatus}`}>
      {displayLabel}
    </span>
  );
};
