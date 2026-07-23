import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  PlusCircle, 
  User, 
  LogOut, 
  ShieldAlert,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, logout, isAgent } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <LifeBuoy size={22} />
        </div>
        <span>DeskPulse</span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/tickets" className={({ isActive }) => isActive ? 'active' : ''}>
              <Ticket size={18} />
              <span>Tickets</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/tickets/new" className={({ isActive }) => isActive ? 'active' : ''}>
              <PlusCircle size={18} />
              <span>Create Ticket</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
              <User size={18} />
              <span>My Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <div className="user-avatar">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.role?.replace('ROLE_', '')}
            </div>
          </div>
        </div>

        <button 
          onClick={logout} 
          className="btn btn-secondary" 
          style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
