import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://back-yno2.onrender.com',
  withCredentials: true
});

export const washingMachineAPI = {
  async getAllMachines() {
    try {
      const response = await api.get('/machines');
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  updateMachineStatus(id, status) {
    return api.put(`/machines/${id}`, { status });
  },
  
  startMachine(id) {
    return api.post(`/machines/${id}/start`);
  },
  
  getMachinesList() {
    return api.get('/machines/list');
  },
  
  getMachineById(id) {
    return api.get(`/machines/${id}`);
  },
};

export default api; 