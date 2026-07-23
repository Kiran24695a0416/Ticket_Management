import React from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  const formattedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'N/A';

  return (
    <div className="fade-in">
      <Navbar 
        title="My Profile" 
        subtitle="Manage your personal information and role access." 
      />

      <div style={{ maxWidth: '600px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.fullName}</h2>
              <span className="badge badge-role" style={{ marginTop: '0.25rem' }}>
                {user?.role?.replace('ROLE_', '')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <Mail color="var(--primary)" size={20} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <Shield color="var(--primary)" size={20} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM ACCESS ROLE</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.role}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <Calendar color="var(--primary)" size={20} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>MEMBER SINCE</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formattedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
