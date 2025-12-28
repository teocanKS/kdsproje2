<template>
  <div class="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-4">Kadın Girişimci Bütçesi (Tüm Firmalar)</h3>
    
    <div class="relative" style="height: 300px;">
      <div v-if="loading.allReturns" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
      </div>
      <div v-else-if="errors.allReturns" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-400 text-sm">{{ errors.allReturns }}</p>
        </div>
      </div>
      <div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-500">
        Veri bulunamadı
      </div>
      <canvas ref="chartCanvas" v-show="hasData && !loading.allReturns && !errors.allReturns"></canvas>
    </div>
    
    <p class="text-xs text-gray-500 mt-4">
      Hesaplama: Tahmini Getiri × 0.72 (₺M cinsinden, max 999M)
    </p>
  </div>
</template>

<script setup>
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from 'chart.js'
import { formatMillionsTRY } from '~/utils/formatting.js'

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

const { allReturnsData, loading, errors } = useDashboard()

const chartCanvas = ref(null)
let chartInstance = null

const hasData = computed(() => {
  return allReturnsData.value?.firms && allReturnsData.value.firms.length > 0
})

function createChart() {
  if (!chartCanvas.value || !hasData.value) return
  
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  
  const ctx = chartCanvas.value.getContext('2d')
  const firms = allReturnsData.value.firms || []
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: firms.map(f => f.ad),
      datasets: [{
        label: 'Kadın Girişimci Bütçesi',
        data: firms.map(f => f.kadinBudget / 1_000_000), // Convert to millions for display
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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
              const value = context.raw * 1_000_000 // Convert back to TL
              return `Kadın Girişimci Bütçesi: ${formatMillionsTRY(value)}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9ca3af',
            font: { size: 10 },
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          grid: {
            color: 'rgba(75, 85, 99, 0.3)'
          },
          ticks: {
            color: '#9ca3af',
            callback: function(value) {
              return '₺' + value.toFixed(0) + 'M'
            }
          },
          title: {
            display: true,
            text: 'Bütçe (₺M)',
            color: '#9ca3af'
          }
        }
      }
    }
  })
}

watch(allReturnsData, () => {
  nextTick(() => {
    createChart()
  })
}, { deep: true })

onMounted(() => {
  if (hasData.value) {
    createChart()
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
