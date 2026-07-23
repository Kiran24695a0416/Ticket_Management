import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { TicketCard } from '../components/TicketCard';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    priorityBreakdown: { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 }
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, isAgent } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch recent tickets
        const ticketsData = await ticketService.getTickets({ page: 0, size: 4 });
        setRecentTickets(ticketsData.content || []);

        // Fetch analytics if agent/admin
        if (isAgent) {
          const analyticsData = await ticketService.getAnalytics();
          setMetrics(analyticsData);
        } else {
          // User metrics calculated from page
          setMetrics({
            totalTickets: ticketsData.totalElements || 0,
            openTickets: ticketsData.content?.filter(t => t.status === 'OPEN').length || 0,
            inProgressTickets: ticketsData.content?.filter(t => t.status === 'IN_PROGRESS').length || 0,
            resolvedTickets: ticketsData.content?.filter(t => t.status === 'RESOLVED').length || 0,
            closedTickets: ticketsData.content?.filter(t => t.status === 'CLOSED').length || 0,
            priorityBreakdown: {
              LOW: ticketsData.content?.filter(t => t.priority === 'LOW').length || 0,
              MEDIUM: ticketsData.content?.filter(t => t.priority === 'MEDIUM').length || 0,
              HIGH: ticketsData.content?.filter(t => t.priority === 'HIGH').length || 0,
              URGENT: ticketsData.content?.filter(t => t.priority === 'URGENT').length || 0
            }
          });
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAgent]);

  return (
    <div className="fade-in">
      <Navbar 
        title={`Hello, ${user?.fullName || 'User'}`} 
        subtitle="Here is an overview of your ticket management activity." 
      />

      {/* Metrics Row - Interactive Links */}
      <div className="metrics-grid">
        <Link to="/tickets" style={{ textDecoration: 'none', color: 'inherit' }} className="glass-card metric-card glass-card-interactive">
          <div className="metric-info">
            <h3>Total Tickets</h3>
            <div className="metric-value">{metrics.totalTickets}</div>
          </div>
          <div className="metric-icon">
            <Ticket size={24} />
          </div>
        </Link>

        <Link to="/tickets?status=OPEN" style={{ textDecoration: 'none', color: 'inherit' }} className="glass-card metric-card glass-card-interactive">
          <div className="metric-info">
            <h3>Open Tickets</h3>
            <div className="metric-value" style={{ color: 'var(--info)' }}>{metrics.openTickets}</div>
          </div>
          <div className="metric-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            <Clock size={24} />
          </div>
        </Link>

        <Link to="/tickets?status=IN_PROGRESS" style={{ textDecoration: 'none', color: 'inherit' }} className="glass-card metric-card glass-card-interactive">
          <div className="metric-info">
            <h3>In Progress</h3>
            <div className="metric-value" style={{ color: 'var(--warning)' }}>{metrics.inProgressTickets}</div>
          </div>
          <div className="metric-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <TrendingUp size={24} />
          </div>
        </Link>

        <Link to="/tickets?status=RESOLVED" style={{ textDecoration: 'none', color: 'inherit' }} className="glass-card metric-card glass-card-interactive">
          <div className="metric-info">
            <h3>Resolved</h3>
            <div className="metric-value" style={{ color: 'var(--success)' }}>{metrics.resolvedTickets}</div>
          </div>
          <div className="metric-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
        </Link>
      </div>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Recent Tickets Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Tickets</h2>
            <Link to="/tickets" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</div>
          ) : recentTickets.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No tickets found in your pipeline.</p>
              <Link to="/tickets/new" className="btn btn-primary btn-sm">
                <Plus size={16} />
                <span>Create Your First Ticket</span>
              </Link>
            </div>
          ) : (
            <div className="tickets-grid">
              {recentTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Interactive Priority Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/tickets/new" className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Plus size={18} />
                <span>Create New Ticket</span>
              </Link>
              <Link to="/tickets" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Ticket size={18} />
                <span>Browse All Tickets</span>
              </Link>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Filter by Priority</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Click any priority to view matching tickets:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {Object.entries(metrics.priorityBreakdown || {}).map(([priority, count]) => (
                <Link 
                  key={priority} 
                  to={`/tickets?priority=${priority}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  title={`View all ${priority} priority tickets`}
                >
                  <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', transition: 'background var(--transition-fast)' }} className="priority-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                      <span style={{ textTransform: 'capitalize' }}>{priority.toLowerCase()} Priority</span>
                      <span style={{ 
                        background: 'var(--bg-tertiary)', 
                        padding: '0.1rem 0.4rem', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.75rem' 
                      }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: metrics.totalTickets ? `${(count / metrics.totalTickets) * 100}%` : '0%',
                          background: priority === 'URGENT' ? 'var(--urgent)' : priority === 'HIGH' ? 'var(--warning)' : priority === 'MEDIUM' ? 'var(--info)' : 'var(--success)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.5s ease'
                        }} 
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
