<template>
  <div class="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-4">Atık Geri Dönüşüm Oranı (Top 10)</h3>
    <div class="relative" style="height: 300px;">
      <div v-if="loading.recycling" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
      <div v-else-if="errors.recycling" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-400 text-sm">{{ errors.recycling }}</p>
        </div>
      </div>
      <div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-500">
        Veri bulunamadı
      </div>
      <canvas ref="chartCanvas" v-show="hasData && !loading.recycling && !errors.recycling"></canvas>
    </div>
    <p class="text-xs text-gray-500 mt-4">
      Geri kazanılan atık = Atık Miktarı × (Geri Dönüşüm Oranı / 100)
    </p>
  </div>
</template>

<script setup>
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { chartColors } from '~/utils/formatting.js'

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const { recyclingData, loading, errors } = useDashboard()

const chartCanvas = ref(null)
let chartInstance = null

const hasData = computed(() => {
  return recyclingData.value && recyclingData.value.labels && recyclingData.value.labels.length > 0
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
    type: 'bar',
    data: {
      labels: recyclingData.value.labels,
      datasets: [{
        label: 'Geri Kazanılan Atık (ton)',
        data: recyclingData.value.values,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(16, 185, 129, 0.9)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
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
              const index = context.dataIndex
              const firma = recyclingData.value.firms[index]
              if (!firma) return []
              return [
                `Atık Miktarı: ${(firma.atikMiktari || 0).toLocaleString('tr-TR')} ton`,
                `Geri Dönüşüm Oranı: %${firma.geriDonusumOrani || 0}`,
                `Geri Kazanılan: ${(firma.geriKazanilanAtik || 0).toLocaleString('tr-TR', { maximumFractionDigits: 2 })} ton`
              ]
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(75, 85, 99, 0.3)'
          },
          ticks: {
            color: '#9ca3af'
          },
          title: {
            display: true,
            text: 'Geri Kazanılan Atık (ton)',
            color: '#9ca3af'
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9ca3af',
            font: {
              size: 11
            }
          }
        }
      }
    }
  })
}

// Watch for data changes and recreate chart
watch(recyclingData, () => {
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
