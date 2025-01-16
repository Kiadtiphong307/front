<script setup>
import { ref, onMounted } from 'vue'
import { washingMachineAPI } from '../services/api'

const updateMachineStatus = async (id, status, time) => {
  try {
    await washingMachineAPI.updateMachineStatus(id, status, time)
    // อัพเดทสถานะในหน้าจอ
  } catch (error) {
    console.error('Error:', error)
  }
}

const updateTime = async (id, time) => {
  try {
    await washingMachineAPI.updateMachineTime(id, time)
    // อัพเดทเวลาในหน้าจอ
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>