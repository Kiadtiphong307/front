<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800">BeeBox Washing</h1>
      <p class="text-gray-600 mt-2">ระบบจัดการเครื่องซักผ้าอัตโนมัติ</p>
    </div>

    <!-- สถานะภาพรวม -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-gray-600">เครื่องทั้งหมด</h3>
        <p class="text-2xl font-bold">{{ machines.length }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-gray-600">เครื่องที่ว่าง</h3>
        <p class="text-2xl font-bold text-green-500">
          {{ machines.filter(m => !m.status).length }}
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-gray-600">กำลังทำงาน</h3>
        <p class="text-2xl font-bold text-red-500">
          {{ machines.filter(m => m.status).length }}
        </p>
      </div>
    </div>

    <!-- รายการเครื่องซักผ้า -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="machine in machines" 
           :key="machine.id" 
           class="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
        <div class="relative">
          <img :src="machine.imageSrc"
               class="w-full h-48 object-cover" />
          <div class="absolute top-2 right-2">
            <span :class="[
              'px-3 py-1 rounded-full text-sm font-medium',
              machine.status ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            ]">
              {{ machine.status ? 'กำลังทำงาน' : 'ว่าง' }}
            </span>
          </div>
        </div>

        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            {{ machine.name }}
          </h3>
          
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-600">เวลาที่เหลือ</span>
            <span class="text-lg font-semibold">
              {{ machine.time }} วินาที
            </span>
          </div>

          <button
            class="w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            :class="buttonClasses(machine)"
            :disabled="machine.status"
            @click="handleClick(machine.id)"
          >
            <span v-if="!machine.status">
              <i class="fas fa-coins mr-2"></i>หยอดเหรียญ
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin mr-2"></i>กำลังทำงาน
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>

<footer>
  <div class="text-center py-4">
    <p>&copy; 2025 BeeBox Washing. All rights reserved.</p>
  </div>
</footer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { washingMachineAPI } from '../services/api';

const machines = ref([]);
const todayIncome = ref(0);

const buttonClasses = (machine) => {
  return machine.status 
    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
    : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg';
};

onMounted(async () => {
  try {
    const response = await washingMachineAPI.getAllMachines();
    console.log('API Response:', response);

    if (response.data) {
      machines.value = response.data.map(machine => ({
        ...machine,
        imageSrc: "/image/washing.png",
        workingImage: "/image/test.gif",
      }));
    }
    
    console.log('Machines:', machines.value);
    
  } catch (error) {
    console.error('Error loading machines:', error);
  }
});

const handleClick = async (id) => {
  const machine = machines.value.find(m => m.id === id);
  if (!machine.status) {
    try {
      await washingMachineAPI.startMachine(id);
      
      machine.status = true;
      const originalImage = machine.imageSrc;
      machine.imageSrc = machine.workingImage;
      
      const timer = setInterval(async () => {
        if (machine.time > 0) {
          machine.time--;
        }
        
        if (machine.time === 0) {
          clearInterval(timer);
          machine.status = false;
          machine.imageSrc = originalImage;
          machine.time = 10;
          await washingMachineAPI.updateMachineStatus(id, false);
          todayIncome.value += 10; // เพิ่มรายได้เมื่อซักเสร็จ
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting machine:', error);
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f3f4f6;
}

.transition-transform {
  transition: transform 0.3s ease;
}
</style>

