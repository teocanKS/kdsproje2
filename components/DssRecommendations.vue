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

// Find selected firm in recycling data
const selectedFirmRecycling = computed(() => {
  if (!recyclingData.value?.firms || !selectedFirmaId.value) return null
  return recyclingData.value.firms.find(f => f.id === selectedFirmaId.value)
})

// Recycling performance analysis
const recyclingRank = computed(() => {
  if (!recyclingData.value?.firms || !selectedFirmaId.value) return -1
  return recyclingData.value.firms.findIndex(f => f.id === selectedFirmaId.value) + 1
})

const recyclingPerformanceLabel = computed(() => {
  if (recyclingRank.value === -1) return 'N/A'
  if (recyclingRank.value <= 3) return 'Top 3'
  if (recyclingRank.value <= 10) return 'Top 10'
  return 'Orta'
})

const recyclingBadgeClass = computed(() => {
  if (recyclingRank.value === -1) return 'bg-gray-600 text-gray-300'
  if (recyclingRank.value <= 3) return 'bg-green-500/20 text-green-400'
  if (recyclingRank.value <= 10) return 'bg-amber-500/20 text-amber-400'
  return 'bg-red-500/20 text-red-400'
})

const recyclingInsight = computed(() => {
  const firm = selectedFirmRecycling.value
  if (!firm) return 'Veri yok'
  return `${firm.geriDonusumOrani || 0}% geri dönüşüm oranı ile ${(firm.geriKazanilanAtik || 0).toFixed(1)} ton atık geri kazanılıyor.`
})

// Budget analysis
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
  const ciro = kpis.value?.ciro || 0
  const alloc = budgetAllocation.value
  if (ciro === 0) return 'Ciro verisi yok'
  const pct = ((alloc / ciro) * 100).toFixed(1)
  return `Ciro'nun %${pct}'i kadın girişimci bütçesine ayrılıyor (${formatMillionsTRY(alloc)}).`
})

// Sustainability ranking
const sustainabilityRank = computed(() => {
  if (!sustainabilityData.value?.firms || !selectedFirmaId.value) return -1
  return sustainabilityData.value.firms.findIndex(f => f.id === selectedFirmaId.value) + 1
})

const sustainabilityRankLabel = computed(() => {
  if (sustainabilityRank.value === -1) return 'Sırasız'
  if (sustainabilityRank.value <= 3) return `#${sustainabilityRank.value}`
  if (sustainabilityRank.value <= 7) return 'Top 7'
  return 'Sırasız'
})

const sustainabilityBadgeClass = computed(() => {
  if (sustainabilityRank.value === -1) return 'bg-gray-600 text-gray-300'
  if (sustainabilityRank.value <= 3) return 'bg-green-500/20 text-green-400'
  return 'bg-amber-500/20 text-amber-400'
})

const sustainabilityInsight = computed(() => {
  if (sustainabilityRank.value === -1) return 'Sürdürülebilirlik puanı bulunamadı'
  const firm = sustainabilityData.value?.firms?.find(f => f.id === selectedFirmaId.value)
  const score = firm?.puan || 0
  return `${score.toFixed(2)} puan ile Top 7 sıralamasında ${sustainabilityRank.value}. sırada.`
})

// Generate recommendations dynamically
const recommendations = computed(() => {
  const recs = []
  
  if (!selectedFirmaId.value) return recs

  // 1) Geri Dönüşüm Yatırımını Artır
  const firm = selectedFirmRecycling.value
  if (firm && firm.geriDonusumOrani < 50 && firm.atikMiktari > 100) {
    recs.push({
      id: 'recycling',
      icon: '♻️',
      title: 'Geri Dönüşüm Yatırımını Artır',
      priority: firm.geriDonusumOrani < 30 ? 'Yüksek' : 'Orta',
      explanation: `${firm.atikMiktari.toLocaleString('tr-TR')} ton atık üretiliyor ancak sadece %${firm.geriDonusumOrani} geri dönüştürülüyor. Potansiyel ${((firm.atikMiktari * 0.7) - firm.geriKazanilanAtik).toFixed(0)} ton ek geri kazanım sağlanabilir.`,
      actions: [
        'Atık ayrıştırma sistemlerini modernize edin',
        'Geri dönüşüm tedarikçileriyle yeni anlaşmalar yapın',
        '6 ay içinde %70 geri dönüşüm hedefi belirleyin'
      ]
    })
  }

  // 2) Kadın Girişimci Bütçesini Optimize Et
  const alloc = budgetAllocation.value
  const ciro = kpis.value?.ciro || 0
  if (ciro > 0 && alloc < ciro * 0.5) {
    recs.push({
      id: 'budget',
      icon: '💰',
      title: 'Kadın Girişimci Bütçesini Optimize Et',
      priority: alloc < ciro * 0.3 ? 'Yüksek' : 'Orta',
      explanation: `Mevcut bütçe tahsisi ${formatMillionsTRY(alloc)}. Hedef oran %72 olup, ek ${formatMillionsTRY((ciro * 0.72) - alloc)} ayrılabilir.`,
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
  if (sustainabilityRank.value === -1 || sustainabilityRank.value > 5) {
    recs.push({
      id: 'sustainability',
      icon: '🌱',
      title: 'Sürdürülebilirlik Puanını Artır',
      priority: sustainabilityRank.value === -1 ? 'Yüksek' : 'Orta',
      explanation: sustainabilityRank.value === -1 
        ? 'Firma henüz sürdürülebilirlik sıralamasında yer almıyor. Çevresel uyum puanını artırın.'
        : `Mevcut sıralama: #${sustainabilityRank.value}. Top 3'e girmek için ek çevresel yatırımlar gerekli.`,
      actions: [
        'Karbon ayak izi ölçümü ve raporlama sistemini kurun',
        'Yeşil enerji kaynaklarına geçiş planlayın',
        'ISO 14001 sertifikasyonu hedefleyin'
      ]
    })
  }

  // 5) Tahmini Getiriyi Değerlendirin
  const getiri = kpis.value?.tahminiGetiri || 0
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
