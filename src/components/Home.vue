<template>
  <div class="container">
    <h1>BeeBox Washing</h1>
    <h2>ระบบจัดการเครื่องซักผ้าอัตโนมัติ</h2>

    <!-- Stats Display -->
    <div class="stats">
      <div class="stat-card">
        <h3>เครื่องทั้งหมด</h3>
        <p>{{ stats.total }}</p>
      </div>
      <div class="stat-card">
        <h3>เครื่องว่าง</h3>
        <p>{{ stats.available }}</p>
      </div>
      <div class="stat-card">
        <h3>กำลังทำงาน</h3>
        <p>{{ stats.inUse }}</p>
      </div>
    </div>

    <!-- Machines Display -->
    <div v-if="loading">กำลังโหลด...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="machines.length === 0" class="no-data">ไม่พบข้อมูลเครื่องซักผ้า</div>
    <div v-else class="machines-grid">
      <div v-for="machine in machines" :key="machine.id" class="machine-card">
        <h3>{{ machine.name }}</h3>
        <p>สถานะ: {{ machine.status ? 'กำลังทำงาน' : 'ว่าง' }}</p>
        <p>เวลา: {{ machine.time }} นาที</p>
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
const loading = ref(true)
const error = ref(null)

const loadData = async () => {
  try {
    loading.value = true
    const [machinesData, statsData] = await Promise.all([
      washingMachineAPI.getAllMachines(),
      washingMachineAPI.getStats()
    ])
    console.log('Loaded machines:', machinesData) // เพิ่ม logging
    machines.value = machinesData
    stats.value = statsData
  } catch (err) {
    error.value = err.message
    console.error('Error loading data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.machines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.machine-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.error {
  color: red;
  text-align: center;
  margin: 20px 0;
}

.no-data {
  text-align: center;
  margin: 20px 0;
  color: #666;
}
</style>

