import api from './api';

export const ticketService = {
  getTickets: async (params = {}) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  updateTicket: async (id, updateData) => {
    const response = await api.put(`/tickets/${id}`, updateData);
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  getTicketActivities: async (id) => {
    const response = await api.get(`/tickets/${id}/activities`);
    return response.data;
  },

  getComments: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  addComment: async (ticketId, commentData) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  }
};
