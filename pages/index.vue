<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Header -->
    <header class="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Sabancı Vakfı</h1>
              <p class="text-xs text-gray-400">Karar Destek Sistemi</p>
            </div>
          </div>
          <div class="hidden sm:block">
            <span class="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
              6-12 Aylık Stratejik Planlama
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Line Charts Grid (Replace KPI Cards) -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Estimated Return Line Chart -->
        <ClientOnly>
          <EstimatedReturnChart />
        </ClientOnly>

        <!-- Female Budget Line Chart -->
        <ClientOnly>
          <FemaleBudgetChart />
        </ClientOnly>
      </section>

      <!-- Charts Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Sustainability Chart -->
        <ClientOnly>
          <SustainabilityChart />
        </ClientOnly>

        <!-- Recycling Chart -->
        <ClientOnly>
          <RecyclingChart />
        </ClientOnly>
      </section>

      <!-- Entrepreneur Chart (Full Width) -->
      <section class="mb-8">
        <ClientOnly>
          <EntrepreneurChart />
        </ClientOnly>
      </section>

      <!-- Firm Selector (now above DSS Recommendations) -->
      <section class="mb-4">
        <div class="max-w-xs">
          <ClientOnly>
            <FirmSelector />
          </ClientOnly>
        </div>
      </section>

      <!-- DSS Recommendations Section -->
      <section class="mb-8">
        <ClientOnly>
          <DssRecommendations />
        </ClientOnly>
      </section>

      <!-- Footer Info -->
      <footer class="text-center py-8 border-t border-gray-700">
        <p class="text-sm text-gray-500">
          Sürdürülebilirlik Karar Destek Sistemi - Stratejik Planlama Aracı
        </p>
        <p class="text-xs text-gray-600 mt-2">
          Parametreleri değiştirerek farklı senaryoları analiz edebilirsiniz.
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup>
const { initDashboard } = useDashboard()

// Initialize dashboard data on mount
onMounted(async () => {
  await initDashboard()
})
</script>

<style>
/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Custom range slider styling */
input[type="range"] {
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
