import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ticketService } from '../services/ticketService';

export const CreateTicketPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('TECHNICAL');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const created = await ticketService.createTicket({
        title,
        description,
        priority,
        category
      });
      navigate(`/tickets/${created.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/tickets" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', gap: '0.35rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Tickets</span>
        </Link>
      </div>

      <Navbar 
        title="Submit New Support Ticket" 
        subtitle="Provide details about your inquiry or technical issue to get support." 
      />

      <div style={{ maxWidth: '720px' }}>
        <div className="glass-card">
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
              <label className="form-label">Ticket Title / Summary *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Unable to access billing dashboard after password reset"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select 
                  className="form-select" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="TECHNICAL">Technical Support</option>
                  <option value="BILLING">Billing & Subscription</option>
                  <option value="FEATURE_REQUEST">Feature Request</option>
                  <option value="GENERAL">General Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency / Priority *</label>
                <select 
                  className="form-select" 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="LOW">Low - Routine inquiry</option>
                  <option value="MEDIUM">Medium - Standard issue</option>
                  <option value="HIGH">High - Important impact</option>
                  <option value="URGENT">Urgent - System down / Blocker</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description *</label>
              <textarea 
                className="form-textarea" 
                placeholder="Describe the problem, steps to reproduce, expected behavior, and any error messages..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <Link to="/tickets" className="btn btn-secondary">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                <Send size={16} />
                <span>{isSubmitting ? 'Submitting Ticket...' : 'Submit Ticket'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
