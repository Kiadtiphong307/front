import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const washingMachineAPI = {
  getAllMachines() {
    return api.get('/machines');
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