<template>
  <div class="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-4">Sürdürülebilirlik Uyum Puanı (Top 7)</h3>
    <div class="relative" style="height: 300px;">
      <div v-if="loading.sustainability" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
      <div v-else-if="errors.sustainability" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-400 text-sm">{{ errors.sustainability }}</p>
        </div>
      </div>
      <div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-500">
        Veri bulunamadı
      </div>
      <canvas ref="chartCanvas" v-show="hasData && !loading.sustainability && !errors.sustainability"></canvas>
    </div>
    <p class="text-xs text-gray-500 mt-4">
      Sürdürülebilirlik uyum puanı yüksek olan firmalar çevresel kriterlere daha uyumludur.
    </p>
  </div>
</template>

<script setup>
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import { chartColors } from '~/utils/formatting.js'

// Register Chart.js components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const { sustainabilityData, loading, errors } = useDashboard()

const chartCanvas = ref(null)
let chartInstance = null

const hasData = computed(() => {
  return sustainabilityData.value && sustainabilityData.value.labels && sustainabilityData.value.labels.length > 0
})

function createChart() {
  if (!chartCanvas.value || !hasData.value) return
  
  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sustainabilityData.value.labels,
      datasets: [{
        data: sustainabilityData.value.values,
        backgroundColor: chartColors.primary.slice(0, 7),
        borderColor: chartColors.borders.slice(0, 7),
        borderWidth: 2,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#9ca3af',
            font: {
              size: 11
            },
            padding: 12,
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#fff',
          bodyColor: '#d1d5db',
          borderColor: '#374151',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function(context) {
              const value = context.parsed
              return `Puan: ${value.toFixed(2)}`
            }
          }
        }
      },
      cutout: '60%'
    }
  })
}

// Watch for data changes and recreate chart
watch(sustainabilityData, () => {
  nextTick(() => {
    createChart()
  })
}, { deep: true })

// Create chart on mount (client-side only)
onMounted(() => {
  if (hasData.value) {
    createChart()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
