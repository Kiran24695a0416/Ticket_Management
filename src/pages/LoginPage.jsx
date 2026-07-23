import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LifeBuoy, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Unable to connect to backend server. Please verify Spring Boot is running on http://localhost:8080.');
      } else {
        const msg = err.response.data?.message || err.response.data?.error || 'Invalid email address or password. Please try again.';
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="sidebar-logo-icon" style={{ margin: '0 auto', width: '48px', height: '48px' }}>
            <LifeBuoy size={28} />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage your support tickets</p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="user@system.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
            QUICK DEMO LOGINS:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => fillDemo('admin@system.com', 'Admin@123')}
            >
              Admin
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => fillDemo('agent@system.com', 'Agent@123')}
            >
              Support Agent
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => fillDemo('user@system.com', 'User@123')}
            >
              Customer User
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 700 }}>Register now</Link>
        </div>
      </div>
    </div>
  );
};
