<template>
  <div class="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
    <h3 class="text-lg font-semibold text-white mb-6 flex items-center">
      <svg class="w-6 h-6 mr-2 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Karar Destek Önerileri (6–12 Ay)
    </h3>

    <!-- Empty State -->
    <div v-if="!selectedFirmaId" class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>Firma seçildiğinde karar önerileri oluşturulacaktır.</p>
    </div>

    <div v-else>
      <!-- Insight KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Geri Dönüşüm Performansı -->
        <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-600">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-400">Geri Dönüşüm Performansı</span>
            <span :class="recyclingBadgeClass" class="text-xs px-2 py-1 rounded-full font-medium">
              {{ recyclingPerformanceLabel }}
            </span>
          </div>
          <p class="text-sm text-gray-300">{{ recyclingInsight }}</p>
        </div>

        <!-- Bütçe Kullanım Durumu -->
        <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-600">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-400">Bütçe Kullanım Durumu</span>
            <span :class="budgetBadgeClass" class="text-xs px-2 py-1 rounded-full font-medium">
              {{ budgetStatusLabel }}
            </span>
          </div>
          <p class="text-sm text-gray-300">{{ budgetInsight }}</p>
        </div>

        <!-- Sürdürülebilirlik Sıralaması -->
        <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-600">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-400">Sürdürülebilirlik Sıralaması</span>
            <span :class="sustainabilityBadgeClass" class="text-xs px-2 py-1 rounded-full font-medium">
              {{ sustainabilityRankLabel }}
            </span>
          </div>
          <p class="text-sm text-gray-300">{{ sustainabilityInsight }}</p>
        </div>
      </div>

      <!-- Recommendation Cards -->
      <div class="space-y-4">
        <div 
          v-for="rec in recommendations" 
          :key="rec.id"
          class="bg-gray-900/30 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-all"
        >
          <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-white flex items-center">
              <span class="mr-2">{{ rec.icon }}</span>
              {{ rec.title }}
            </h4>
            <span :class="getPriorityClass(rec.priority)" class="text-xs px-2 py-1 rounded-full font-medium">
              {{ rec.priority }}
            </span>
          </div>
          <p class="text-sm text-gray-300 mb-3">{{ rec.explanation }}</p>
          <div class="space-y-1">
            <p class="text-xs text-gray-500 font-medium mb-1">Önerilen Aksiyonlar:</p>
            <ul class="space-y-1">
              <li v-for="(action, idx) in rec.actions" :key="idx" class="text-xs text-gray-400 flex items-start">
                <span class="text-accent-400 mr-2">→</span>
                {{ action }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="recommendations.length === 0" class="text-center py-6 text-gray-500">
        <p class="text-sm">Bu firma için şu an öneri bulunmuyor. Tüm metrikler hedef değerlerle uyumlu.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatMillionsTRY } from '~/utils/formatting.js'

const { 
  selectedFirmaId, 
  kpis, 
  recyclingData, 
  sustainabilityData,
  entrepreneurData,
  dssParams
} = useDashboard()

// Find selected firm in recycling data - now use allFirms for complete lookup
const selectedFirmRecycling = computed(() => {
  if (!selectedFirmaId.value) return null
  // First try allFirms (includes all firms with ranks)
  const allFirms = recyclingData.value?.allFirms
  if (allFirms && Array.isArray(allFirms)) {
    return allFirms.find(f => f.id === selectedFirmaId.value)
  }
  // Fallback to top 10 firms
  const firms = recyclingData.value?.firms
  if (firms && Array.isArray(firms)) {
    return firms.find(f => f.id === selectedFirmaId.value)
  }
  return null
})

// Recycling rank from the data (already computed in backend)
const recyclingRank = computed(() => {
  const firm = selectedFirmRecycling.value
  if (!firm) return -1
  return firm.rank || -1
})

const recyclingPerformanceLabel = computed(() => {
  const rank = recyclingRank.value
  if (rank === -1) return 'N/A'
  if (rank <= 3) return 'Top 3'
  if (rank <= 10) return 'Top 10'
  return `#${rank}`
})

const recyclingBadgeClass = computed(() => {
  const rank = recyclingRank.value
  if (rank === -1) return 'bg-gray-600 text-gray-300'
  if (rank <= 3) return 'bg-green-500/20 text-green-400'
  if (rank <= 10) return 'bg-amber-500/20 text-amber-400'
  return 'bg-red-500/20 text-red-400'
})

const recyclingInsight = computed(() => {
  const firm = selectedFirmRecycling.value
  if (!firm) return 'Geri dönüşüm verisi bulunamadı'
  const orani = firm.geriDonusumOrani || 0
  const kazanilan = firm.geriKazanilanAtik || 0
  return `${orani}% geri dönüşüm oranı ile ${kazanilan.toFixed(1)} ton atık geri kazanılıyor.`
})

// Budget analysis - using tahmini_getiri as the base (NOT ciro)
const tahminiGetiri = computed(() => {
  return kpis.value?.tahminiGetiri || 0
})

const budgetCeiling = computed(() => {
  const yuzdesi = kpis.value?.butceYuzdesi || 0.72
  return tahminiGetiri.value * yuzdesi
})

const budgetAllocation = computed(() => {
  return kpis.value?.kadinGirisimciBütcesi || 0
})

const budgetStatusLabel = computed(() => {
  const alloc = budgetAllocation.value
  if (alloc === 0) return 'Belirsiz'
  if (alloc < 10_000_000) return 'Düşük'
  if (alloc < 100_000_000) return 'Dengeli'
  return 'Yüksek'
})

const budgetBadgeClass = computed(() => {
  const alloc = budgetAllocation.value
  if (alloc === 0) return 'bg-gray-600 text-gray-300'
  if (alloc < 10_000_000) return 'bg-red-500/20 text-red-400'
  if (alloc < 100_000_000) return 'bg-green-500/20 text-green-400'
  return 'bg-amber-500/20 text-amber-400'
})

const budgetInsight = computed(() => {
  const getiri = tahminiGetiri.value
  const alloc = budgetAllocation.value
  if (getiri === 0) return 'Tahmini getiri verisi yok'
  const pct = ((alloc / getiri) * 100).toFixed(1)
  return `Tahmini getirinin %${pct}'i kadın girişimci bütçesine ayrılıyor (${formatMillionsTRY(alloc)}).`
})

// Sustainability ranking - now use allFirms for complete lookup
const selectedFirmSustainability = computed(() => {
  if (!selectedFirmaId.value) return null
  // First try allFirms (includes all firms with ranks)
  const allFirms = sustainabilityData.value?.allFirms
  if (allFirms && Array.isArray(allFirms)) {
    return allFirms.find(f => f.id === selectedFirmaId.value)
  }
  // Fallback to top 7 firms
  const firms = sustainabilityData.value?.firms
  if (firms && Array.isArray(firms)) {
    return firms.find(f => f.id === selectedFirmaId.value)
  }
  return null
})

const sustainabilityRank = computed(() => {
  const firm = selectedFirmSustainability.value
  if (!firm) return -1
  return firm.rank || -1
})

const sustainabilityRankLabel = computed(() => {
  const rank = sustainabilityRank.value
  if (rank === -1) return 'Sırasız'
  if (rank <= 3) return `#${rank}`
  if (rank <= 7) return `Top 7 (#${rank})`
  return `Top 7 dışında (#${rank})`
})

const sustainabilityBadgeClass = computed(() => {
  const rank = sustainabilityRank.value
  if (rank === -1) return 'bg-gray-600 text-gray-300'
  if (rank <= 3) return 'bg-green-500/20 text-green-400'
  if (rank <= 7) return 'bg-amber-500/20 text-amber-400'
  return 'bg-red-500/20 text-red-400'
})

const sustainabilityInsight = computed(() => {
  const firm = selectedFirmSustainability.value
  if (!firm) return 'Sürdürülebilirlik puanı bulunamadı'
  const score = firm.puan || 0
  const rank = firm.rank || 0
  if (rank <= 7) {
    return `${score.toFixed(2)} puan ile sürdürülebilirlik sıralamasında #${rank}.`
  }
  return `${score.toFixed(2)} puan ile sıralamada #${rank} (Top 7 dışında).`
})

// Generate recommendations dynamically
const recommendations = computed(() => {
  const recs = []
  
  if (!selectedFirmaId.value) return recs

  // 1) Geri Dönüşüm Yatırımını Artır
  const firm = selectedFirmRecycling.value
  if (firm && (firm.geriDonusumOrani || 0) < 50 && (firm.atikMiktari || 0) > 100) {
    const atik = firm.atikMiktari || 0
    const oran = firm.geriDonusumOrani || 0
    const kazanilan = firm.geriKazanilanAtik || 0
    recs.push({
      id: 'recycling',
      icon: '♻️',
      title: 'Geri Dönüşüm Yatırımını Artır',
      priority: oran < 30 ? 'Yüksek' : 'Orta',
      explanation: `${atik.toLocaleString('tr-TR')} ton atık üretiliyor ancak sadece %${oran} geri dönüştürülüyor. Potansiyel ${((atik * 0.7) - kazanilan).toFixed(0)} ton ek geri kazanım sağlanabilir.`,
      actions: [
        'Atık ayrıştırma sistemlerini modernize edin',
        'Geri dönüşüm tedarikçileriyle yeni anlaşmalar yapın',
        '6 ay içinde %70 geri dönüşüm hedefi belirleyin'
      ]
    })
  }

  // 2) Kadın Girişimci Bütçesini Optimize Et
  const getiri = tahminiGetiri.value
  const alloc = budgetAllocation.value
  const ceiling = budgetCeiling.value
  
  if (getiri > 0 && alloc < ceiling * 0.8) {
    recs.push({
      id: 'budget',
      icon: '💰',
      title: 'Kadın Girişimci Bütçesini Optimize Et',
      priority: alloc < ceiling * 0.5 ? 'Yüksek' : 'Orta',
      explanation: `Mevcut bütçe tahsisi ${formatMillionsTRY(alloc)}. Tahmini getirinin %72'si (${formatMillionsTRY(ceiling)}) hedef tavan olup, ek ${formatMillionsTRY(ceiling - alloc)} ayrılabilir.`,
      actions: [
        'Kadın girişimci destekleme programlarını genişletin',
        'Mikro-kredi havuzlarına yatırım yapın',
        'Mentörlük programları için kaynak ayırın'
      ]
    })
  }

  // 3) En Uyumlu Girişimcilerle Çalış
  if (entrepreneurData.value?.girisimciler?.length > 0) {
    const top3 = entrepreneurData.value.girisimciler.slice(0, 3)
    const avgScore = top3.reduce((sum, g) => sum + g.score, 0) / top3.length
    
    recs.push({
      id: 'entrepreneur',
      icon: '🤝',
      title: 'En Uyumlu Girişimcilerle Çalış',
      priority: avgScore > 0.7 ? 'Orta' : 'Düşük',
      explanation: `Mevcut parametreler: Kadın %${dssParams.value.refKadin}, Engelli %${dssParams.value.refEngelli}, Min. Kuruluş ${dssParams.value.refMinYil}. En yüksek skorlu: ${top3.map(g => g.isletmeAdi).join(', ')}.`,
      actions: [
        `${top3[0]?.isletmeAdi || 'Top girişimci'} ile stratejik ortaklık görüşmesi başlatın`,
        'Uyumluluk skorlarını çeyreklik olarak takip edin',
        'Yatırım portföyünü top 5 girişimciye göre çeşitlendirin'
      ]
    })
  }

  // 4) Sürdürülebilirlik Puanını Artır
  const susRank = sustainabilityRank.value
  if (susRank === -1 || susRank > 5) {
    recs.push({
      id: 'sustainability',
      icon: '🌱',
      title: 'Sürdürülebilirlik Puanını Artır',
      priority: susRank === -1 ? 'Yüksek' : 'Orta',
      explanation: susRank === -1 
        ? 'Firma henüz sürdürülebilirlik sıralamasında yer almıyor. Çevresel uyum puanını artırın.'
        : `Mevcut sıralama: #${susRank}. Top 3'e girmek için ek çevresel yatırımlar gerekli.`,
      actions: [
        'Karbon ayak izi ölçümü ve raporlama sistemini kurun',
        'Yeşil enerji kaynaklarına geçiş planlayın',
        'ISO 14001 sertifikasyonu hedefleyin'
      ]
    })
  }

  // 5) Tahmini Getiriyi Değerlendirin
  if (getiri > 0) {
    recs.push({
      id: 'forecast',
      icon: '📈',
      title: 'Tahmini Getiri Değerlendirmesi',
      priority: 'Düşük',
      explanation: `6-12 aylık dönem için tahmini getiri: ${formatMillionsTRY(getiri)}. Bu projeksiyon, mevcut büyüme trendlerine dayanmaktadır.`,
      actions: [
        'Çeyreklik KPI takip toplantıları düzenleyin',
        'Risk senaryoları için alternatif planlar oluşturun',
        'Büyüme hedeflerini pazar koşullarına göre güncelleyin'
      ]
    })
  }

  return recs
})

function getPriorityClass(priority) {
  switch (priority) {
    case 'Yüksek': return 'bg-red-500/20 text-red-400'
    case 'Orta': return 'bg-amber-500/20 text-amber-400'
    case 'Düşük': return 'bg-green-500/20 text-green-400'
    default: return 'bg-gray-600 text-gray-300'
  }
}
</script>
