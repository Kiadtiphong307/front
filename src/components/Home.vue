<template>
  <div class="container">
    <div class="header">
      <h1>BeeBox Washing</h1>
      <p>ระบบจัดการเครื่องซักผ้าอัตโนมัติ</p>
    </div>

    <div class="stats-container">
      <div class="stat-box">
        <div class="stat-title">เครื่องทั้งหมด</div>
        <div class="stat-value">{{ stats.total }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-title">เครื่องว่าง</div>
        <div class="stat-value green">{{ stats.available }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-title">กำลังทำงาน</div>
        <div class="stat-value red">{{ stats.inUse }}</div>
      </div>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <div class="machines-grid">
      <div v-for="machine in machines" 
           :key="machine.id" 
           class="machine-card"
           :class="{ 'in-use': machine.status }">
        <h3>{{ machine.name }}</h3>
        <div class="status-badge" :class="{ 'status-active': machine.status }">
          {{ machine.status ? 'กำลังทำงาน' : 'ว่าง' }}
        </div>
        <div class="time">
          <i class="fas fa-clock"></i>
          {{ machine.time }} นาที
        </div>
        <button 
          @click="machine.status ? stopMachine(machine.id) : startMachine(machine.id)"
          :class="{ 'btn-stop': machine.status, 'btn-start': !machine.status }"
          :disabled="loading">
          {{ machine.status ? 'หยุดการทำงาน' : 'เริ่มใช้งาน' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { washingMachineAPI } from '../services/api'

const machines = ref([])
const stats = ref({
  total: 0,
  available: 0,
  inUse: 0
})
const loading = ref(false)
const error = ref(null)

const loadData = async () => {
  try {
    const [machinesData, statsData] = await Promise.all([
      washingMachineAPI.getAllMachines(),
      washingMachineAPI.getStats()
    ])
    machines.value = machinesData
    stats.value = statsData
  } catch (err) {
    error.value = err.message
    console.error('Error loading data:', err)
  }
}

const startMachine = async (id) => {
  try {
    loading.value = true
    await washingMachineAPI.startMachine(id)
    await loadData()
  } catch (err) {
    console.error('Error starting machine:', err)
  } finally {
    loading.value = false
  }
}

const stopMachine = async (id) => {
  try {
    loading.value = true
    await washingMachineAPI.stopMachine(id)
    await loadData()
  } catch (err) {
    console.error('Error stopping machine:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 1.2em;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-title {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #2c3e50;
}

.green { color: #4CAF50; }
.red { color: #f44336; }

.machines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.machine-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.machine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.machine-card h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.status-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  background: #e8f5e9;
  color: #4CAF50;
  font-size: 0.9em;
  margin-bottom: 15px;
}

.status-badge.status-active {
  background: #ffebee;
  color: #f44336;
}

.time {
  color: #666;
  margin-bottom: 20px;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-start {
  background: #4CAF50;
  color: white;
}

.btn-stop {
  background: #f44336;
  color: white;
}

.btn-start:hover {
  background: #45a049;
}

.btn-stop:hover {
  background: #e53935;
}

.error {
  text-align: center;
  color: #f44336;
  padding: 20px;
  background: #ffebee;
  border-radius: 8px;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .machines-grid {
    grid-template-columns: 1fr;
  }
}
</style>

