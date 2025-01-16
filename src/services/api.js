import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://back-yno2.onrender.com',
  withCredentials: true
});

export const washingMachineAPI = {
  async getStats() {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error loading stats:', error);
      throw error;
    }
  },
  
  async getAllMachines() {
    try {
      const response = await api.get('/machines');
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error loading machines:', error);
      throw error;
    }
  },
  
  async startMachine(id) {
    try {
      const response = await api.post(`/machines/${id}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting machine:', error);
      throw error;
    }
  },
  
  async stopMachine(id) {
    try {
      const response = await api.post(`/machines/${id}/stop`);
      return response.data;
    } catch (error) {
      console.error('Error stopping machine:', error);
      throw error;
    }
  },
  
  async updateMachineStatus(id, status, time) {
    try {
      const response = await api.put(`/machines/${id}`, { status, time });
      return response.data;
    } catch (error) {
      console.error('Error updating machine status:', error);
      throw error;
    }
  },
  
  async updateMachineTime(id, time) {
    try {
      const response = await api.put(`/machines/${id}/time`, { time });
      return response.data;
    } catch (error) {
      console.error('Error updating machine time:', error);
      throw error;
    }
  },
  
  getMachinesList() {
    return api.get('/machines/list');
  },
  
  getMachineById(id) {
    return api.get(`/machines/${id}`);
  },
};

export default api; 