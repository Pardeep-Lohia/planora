import apiClient from './apiClient.js';

export const analyticsApi = {
  today: () => apiClient.get('/api/analytics/today'),
  weekly: () => apiClient.get('/api/analytics/weekly')
};

