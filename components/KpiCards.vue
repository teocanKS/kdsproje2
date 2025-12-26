<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Tahmini Getiri Card -->
    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary-500/50">
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 bg-primary-500/20 rounded-xl">
          <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span v-if="loading" class="animate-pulse bg-gray-700 h-6 w-20 rounded"></span>
      </div>
      <h3 class="text-gray-400 text-sm font-medium mb-1">Tahmini Getiri</h3>
      <p class="text-3xl font-bold text-white">{{ formattedGetiri }}</p>
      <p class="text-xs text-gray-500 mt-2">6-12 aylık projeksiyon</p>
    </div>
    
    <!-- Kadın Girişimci Bütçesi Card -->
    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-accent-500/50">
      <div class="flex items-center justify-between mb-4">
        <div class="p-3 bg-accent-500/20 rounded-xl">
          <svg class="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span v-if="loading" class="animate-pulse bg-gray-700 h-6 w-20 rounded"></span>
      </div>
      <h3 class="text-gray-400 text-sm font-medium mb-1">Kadın Girişimci Bütçesi</h3>
      <p class="text-3xl font-bold text-white">{{ formattedButce }}</p>
      <p class="text-xs text-gray-500 mt-2">Ciro x 0.72 hesaplama</p>
    </div>
  </div>
</template>

<script setup>
import { formatMillions } from '~/utils/formatting.js'

const { kpis, loading } = useDashboard()

const formattedGetiri = computed(() => {
  return formatMillions(kpis.value.tahminiGetiri)
})

const formattedButce = computed(() => {
  return formatMillions(kpis.value.kadinGirisimciBütcesi)
})
</script>
