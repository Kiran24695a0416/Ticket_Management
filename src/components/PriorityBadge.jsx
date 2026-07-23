import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const formattedPriority = priority ? priority.toLowerCase() : 'medium';

  return (
    <span className={`badge badge-priority-${formattedPriority}`}>
      {priority}
    </span>
  );
};
