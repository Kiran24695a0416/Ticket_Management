import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { TicketCard } from '../components/TicketCard';
import { ticketService } from '../services/ticketService';

export const TicketListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params whenever URL changes
  useEffect(() => {
    setStatus(searchParams.get('status') || '');
    setPriority(searchParams.get('priority') || '');
    setCategory(searchParams.get('category') || '');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = { page, size: 9 };
      const currentStatus = searchParams.get('status') || '';
      const currentPriority = searchParams.get('priority') || '';
      const currentCategory = searchParams.get('category') || '';
      const currentSearch = searchParams.get('search') || '';

      if (currentStatus) params.status = currentStatus;
      if (currentPriority) params.priority = currentPriority;
      if (currentCategory) params.category = currentCategory;
      if (currentSearch) params.search = currentSearch;

      const data = await ticketService.getTickets(params);
      setTickets(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setPage(0);
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', search);
  };

  const clearAllFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setCategory('');
    setPage(0);
    setSearchParams({});
  };

  const hasActiveFilters = search || status || priority || category;

  return (
    <div className="fade-in">
      <Navbar 
        title="Ticket Portal" 
        subtitle="Search, filter, and manage all your technical and billing support tickets." 
      />

      {/* Toolbar & Filters */}
      <div className="glass-card toolbar-card">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search tickets by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div className="filter-group">
          <select 
            className="form-select" 
            style={{ width: '135px' }}
            value={status} 
            onChange={(e) => updateParam('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: '135px' }}
            value={priority} 
            onChange={(e) => updateParam('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: '145px' }}
            value={category} 
            onChange={(e) => updateParam('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="TECHNICAL">Technical</option>
            <option value="BILLING">Billing</option>
            <option value="FEATURE_REQUEST">Feature</option>
            <option value="GENERAL">General</option>
          </select>

          {hasActiveFilters && (
            <button 
              onClick={clearAllFilters}
              className="btn btn-secondary btn-sm"
              title="Clear all filters"
              style={{ color: 'var(--danger)' }}
            >
              <X size={16} />
              <span>Reset</span>
            </button>
          )}

          <Link to="/tickets/new" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Active Filter Indicator Chips */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Filters:</span>
          {status && (
            <span className="badge badge-role" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Status: {status}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('status', '')} />
            </span>
          )}
          {priority && (
            <span className="badge badge-role" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Priority: {priority}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('priority', '')} />
            </span>
          )}
          {category && (
            <span className="badge badge-role" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Category: {category}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('category', '')} />
            </span>
          )}
          {search && (
            <span className="badge badge-role" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Query: "{search}"
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => updateParam('search', '')} />
            </span>
          )}
        </div>
      )}

      {/* Grid Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading ticket portal...</div>
      ) : tickets.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>No tickets matching your filters</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Try resetting filters or search for another query.</p>
          <button 
            onClick={clearAllFilters} 
            className="btn btn-secondary btn-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button 
                className="btn btn-secondary btn-sm" 
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
