import React from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="top-header">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary" 
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: 'var(--radius-full)' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="user-profile-summary">
          <span className="badge badge-role">
            {user?.role?.replace('ROLE_', '')}
          </span>
        </div>
      </div>
    </header>
  );
};
