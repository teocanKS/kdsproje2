<template>
  <div class="relative">
    <label for="firma-select" class="block text-sm font-medium text-gray-300 mb-2">
      Firma Seçiniz
    </label>
    <select
      id="firma-select"
      v-model="selectedId"
      @change="handleChange"
      class="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:border-gray-500"
      :disabled="loading"
    >
      <option :value="null">-- Tüm Firmalar --</option>
      <option 
        v-for="firma in firms" 
        :key="firma.id" 
        :value="firma.id"
      >
        {{ firma.ad }}
      </option>
    </select>
    <div class="absolute inset-y-0 right-0 top-7 flex items-center pr-3 pointer-events-none">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <div v-if="loading" class="absolute inset-y-0 right-8 top-7 flex items-center">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
    </div>
  </div>
</template>

<script setup>
const { firms, selectedFirmaId, loading, selectFirm } = useDashboard()

const selectedId = ref(selectedFirmaId.value)

watch(selectedFirmaId, (newVal) => {
  selectedId.value = newVal
})

function handleChange() {
  selectFirm(selectedId.value)
}
</script>
