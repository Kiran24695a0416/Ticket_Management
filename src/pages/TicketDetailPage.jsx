import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  User, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  History,
  Trash2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ticketService } from '../services/ticketService';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAgent, isAdmin } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const ticketData = await ticketService.getTicketById(id);
      setTicket(ticketData);

      const commentsData = await ticketService.getComments(id);
      setComments(commentsData);

      const activitiesData = await ticketService.getTicketActivities(id);
      setActivities(activitiesData);

      if (isAgent) {
        const agentList = await authService.getAgents();
        setAgents(agentList);
      }
    } catch (err) {
      console.error('Failed to load ticket detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await ticketService.updateTicket(id, { status: newStatus });
      setTicket(updated);
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const updated = await ticketService.updateTicket(id, { priority: newPriority });
      setTicket(updated);
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to update priority');
    }
  };

  const handleAssignmentChange = async (agentId) => {
    try {
      const updated = await ticketService.updateTicket(id, { assignedToUserId: agentId });
      setTicket(updated);
      fetchTicketDetails();
    } catch (err) {
      alert('Failed to reassign agent');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await ticketService.addComment(id, { content: newComment });
      setNewComment('');
      const commentsData = await ticketService.getComments(id);
      setComments(commentsData);
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        await ticketService.deleteTicket(id);
        navigate('/tickets');
      } catch (err) {
        alert('Failed to delete ticket');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
        Loading ticket information...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Ticket Not Found</h2>
        <Link to="/tickets" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Tickets</Link>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/tickets" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', gap: '0.35rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Ticket List</span>
        </Link>
      </div>

      <Navbar 
        title={`Ticket #${ticket.id}: ${ticket.title}`} 
        subtitle={`Category: ${ticket.category} • Created by ${ticket.createdBy?.fullName}`}
      />

      <div className="ticket-detail-grid">
        
        {/* Left Column: Description & Comments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Ticket Box */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Opened on {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>{ticket.title}</h3>
            
            <div style={{ 
              fontSize: '0.95rem', 
              lineHeight: '1.7', 
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap',
              background: 'var(--bg-tertiary)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              {ticket.description}
            </div>
          </div>

          {/* Comment Thread */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <MessageSquare size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Discussion & Updates ({comments.length})</h3>
            </div>

            <div className="comment-stream">
              {comments.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No comments added yet. Start the conversation below.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                          {comment.author?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{comment.author?.fullName}</span>
                        <span className="badge badge-role">{comment.author?.role?.replace('ROLE_', '')}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', marginTop: '0.4rem' }}>
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <textarea 
                  className="form-textarea"
                  placeholder="Type a response or add notes..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={submittingComment}
              >
                <Send size={14} />
                <span>{submittingComment ? 'Posting...' : 'Post Response'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Sidebar: Controls & Audit Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Controls Panel */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Ticket Controls</h3>

            {isAgent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select" 
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select" 
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Assigned Support Agent</label>
                  <select 
                    className="form-select" 
                    value={ticket.assignedTo?.id || ''}
                    onChange={(e) => handleAssignmentChange(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                  <StatusBadge status={ticket.status} />
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Assigned to: </span>
                  <span style={{ fontWeight: 600 }}>{ticket.assignedTo?.fullName || 'Pending Support Agent'}</span>
                </div>
              </div>
            )}

            {(isAdmin || ticket.createdBy?.id === user?.id) && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  onClick={handleDeleteTicket} 
                  className="btn btn-danger btn-sm" 
                  style={{ width: '100%' }}
                >
                  <Trash2 size={14} />
                  <span>Delete Ticket</span>
                </button>
              </div>
            )}
          </div>

          {/* Audit History Log */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <History size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Activity History</h3>
            </div>

            <div className="timeline">
              {activities.map((act) => (
                <div key={act.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.action}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{act.details}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem', marginTop: '0.2rem' }}>
                    {act.performedBy?.fullName} • {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
