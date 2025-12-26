<template>
  <div class="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-4">Girişimci Uyumluluk Analizi (Top 10)</h3>
    
    <!-- DSS Parameter Controls -->
    <div class="bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-600">
      <h4 class="text-sm font-medium text-gray-300 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        DSS Parametreleri (Senaryo Simülasyonu)
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Kadın Oranı Slider -->
        <div>
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Ref. Kadın Oranı (%)</span>
            <span class="text-primary-400 font-semibold">{{ localParams.refKadin }}%</span>
          </div>
          <input 
            type="range" 
            v-model.number="localParams.refKadin"
            min="0" 
            max="100" 
            step="5"
            @input="debouncedUpdate"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>
        
        <!-- Engelli Oranı Slider -->
        <div>
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Ref. Engelli Oranı (%)</span>
            <span class="text-green-400 font-semibold">{{ localParams.refEngelli }}%</span>
          </div>
          <input 
            type="range" 
            v-model.number="localParams.refEngelli"
            min="0" 
            max="50" 
            step="1"
            @input="debouncedUpdate"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
        
        <!-- Min Kuruluş Yılı Slider -->
        <div>
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>Min. Kuruluş Yılı</span>
            <span class="text-amber-400 font-semibold">{{ localParams.refMinYil }}</span>
          </div>
          <input 
            type="range" 
            v-model.number="localParams.refMinYil"
            :min="2000" 
            :max="2024" 
            step="1"
            @input="debouncedUpdate"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>
      
      <p class="text-xs text-gray-500 mt-3">
        Parametre değerlerini değiştirerek farklı senaryoları test edin. Sıralama anında güncellenir.
      </p>
    </div>
    
    <!-- Chart -->
    <div class="relative" style="height: 350px;">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-accent-500 border-t-transparent"></div>
      </div>
      <div v-else-if="!hasData" class="absolute inset-0 flex items-center justify-center text-gray-500">
        Veri bulunamadı
      </div>
      <canvas ref="chartCanvas" v-show="hasData && !loading"></canvas>
    </div>
    
    <p class="text-xs text-gray-500 mt-4">
      Skor = (Kadın Uyum × 0.4) + (Engelli Uyum × 0.3) + (Yıl Uyum × 0.3)
    </p>
  </div>
</template>

<script setup>
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { chartColors } from '~/utils/formatting.js'

// Register Chart.js components
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const { entrepreneurData, loading, dssParams, updateDssParams } = useDashboard()

const chartCanvas = ref(null)
let chartInstance = null
let debounceTimer = null

// Local copy of params for immediate UI feedback
const localParams = ref({
  refKadin: dssParams.value.refKadin,
  refEngelli: dssParams.value.refEngelli,
  refMinYil: dssParams.value.refMinYil
})

// Sync with global state
watch(dssParams, (newVal) => {
  localParams.value = { ...newVal }
}, { deep: true })

const hasData = computed(() => {
  return entrepreneurData.value && entrepreneurData.value.labels && entrepreneurData.value.labels.length > 0
})

// Debounced update to avoid too many API calls
function debouncedUpdate() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    updateDssParams(localParams.value)
  }, 300)
}

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
      labels: entrepreneurData.value.labels,
      datasets: [{
        label: 'Uyumluluk Skoru',
        data: entrepreneurData.value.values,
        backgroundColor: entrepreneurData.value.values.map((v, i) => {
          // Gradient effect based on score
          if (v >= 0.8) return 'rgba(16, 185, 129, 0.8)'
          if (v >= 0.5) return 'rgba(245, 158, 11, 0.8)'
          return 'rgba(239, 68, 68, 0.8)'
        }),
        borderColor: entrepreneurData.value.values.map((v, i) => {
          if (v >= 0.8) return 'rgba(16, 185, 129, 1)'
          if (v >= 0.5) return 'rgba(245, 158, 11, 1)'
          return 'rgba(239, 68, 68, 1)'
        }),
        borderWidth: 1,
        borderRadius: 6
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
              const index = context.dataIndex
              const g = entrepreneurData.value.girisimciler[index]
              return [
                `Toplam Skor: ${g.score.toFixed(3)}`,
                `Kadın Oranı: %${g.kadinOrani}`,
                `Engelli Oranı: %${g.engelliOrani}`,
                `Kuruluş Yılı: ${g.kurulusYili}`
              ]
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
            font: {
              size: 10
            },
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          grid: {
            color: 'rgba(75, 85, 99, 0.3)'
          },
          ticks: {
            color: '#9ca3af'
          },
          min: 0,
          max: 1,
          title: {
            display: true,
            text: 'Uyumluluk Skoru (0-1)',
            color: '#9ca3af'
          }
        }
      }
    }
  })
}

// Watch for data changes and recreate chart
watch(entrepreneurData, () => {
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
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>
