import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Clock, User } from 'lucide-react';

export const TicketCard = ({ ticket }) => {
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-card glass-card-interactive ticket-item-card fade-in">
      <div>
        <div className="ticket-item-header" style={{ marginBottom: '0.75rem' }}>
          <Link to={`/tickets?status=${ticket.status}`} style={{ textDecoration: 'none' }} title={`Filter by status: ${ticket.status}`}>
            <StatusBadge status={ticket.status} />
          </Link>
          <Link to={`/tickets?priority=${ticket.priority}`} style={{ textDecoration: 'none' }} title={`Filter by priority: ${ticket.priority}`}>
            <PriorityBadge priority={ticket.priority} />
          </Link>
        </div>

        <Link to={`/tickets/${ticket.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="ticket-item-title">{ticket.title}</h3>
        </Link>

        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)', 
          marginTop: '0.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {ticket.description}
        </p>
      </div>

      <div className="ticket-item-meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <User size={14} />
          <span>{ticket.createdBy?.fullName || 'Anonymous'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};
