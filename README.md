# KDS - Karar Destek Sistemi

Sürdürülebilirlik odaklı karar destek sistemi. Orta kademe yöneticiler için 6-12 aylık stratejik planlama aracı.

## Özellikler

- **Firma Seçimi**: Dropdown ile firma seçimi ve KPI görüntüleme
- **KPI Kartları**: Tahmini getiri ve kadın girişimci bütçesi
- **Grafikler**: Chart.js ile görselleştirme
- **DSS Parametreleri**: Senaryo simülasyonu için slider kontrolleri

## Teknoloji Stack

- **Framework**: Nuxt 3 (JavaScript)
- **Styling**: TailwindCSS
- **Charts**: Vanilla Chart.js
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Yerel Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### Environment Variables

Proje `.env` dosyası içermektedir. Supabase bağlantısı için gerekli değişkenler:

- `SUPABASE_URL`: Supabase proje URL'si
- `SUPABASE_ANON_KEY`: Supabase anon/public key

## MVC Klasör Yapısı

```
/server
  /controllers   -> İş mantığı + DSS hesaplamaları
  /db            -> Supabase client + query helpers
  /middlewares   -> Server middleware (opsiyonel)
/server/api      -> Thin route handlers (validasyon + response)
/utils           -> Paylaşılan yardımcılar
/pages           -> Tek sayfa dashboard
/components      -> UI + Chart bileşenleri
/composables     -> State yönetimi + data fetching
```

## API Endpoints

| Endpoint | Açıklama |
|----------|----------|
| `GET /api/firms` | Firma listesi (dropdown için) |
| `GET /api/dashboard/kpis?firma_id=X` | Seçili firma KPI'ları |
| `GET /api/dashboard/sustainability-top7` | Top 7 sürdürülebilirlik puanı |
| `GET /api/dashboard/recycling-top10` | Top 10 geri dönüşüm oranı |
| `GET /api/dashboard/entrepreneur-top10?ref_kadin=X&ref_engelli=Y&ref_min_yil=Z` | DSS parametrik sıralama |

## DSS Parametreleri ve Karar Desteği

### Girişimci Uyumluluk Skoru

Parametreler değiştiğinde sıralama anında güncellenir:

```
score = 
  (kadın_oranı >= ref_kadın ? 1 : kadın_oranı / ref_kadın) × 0.4
+ (engelli_oranı >= ref_engelli ? 1 : engelli_oranı / ref_engelli) × 0.3
+ (kuruluş_yılı >= ref_min_yıl ? 1 : 0) × 0.3
```

### Slider Kontrolleri

| Parametre | Aralık | Varsayılan | Açıklama |
|-----------|--------|------------|----------|
| Ref. Kadın Oranı | 0-100% | 30% | Hedef kadın çalışan oranı |
| Ref. Engelli Oranı | 0-50% | 5% | Hedef engelli çalışan oranı |
| Min. Kuruluş Yılı | 2000-2024 | 2015 | Minimum kabul edilen kuruluş yılı |

## KPI'lar ve Desteklenen Kararlar

### 1. Tahmini Getiri (M)
- **Kaynak**: `firma_tahminleme.tahmini_getiri`
- **Karar Desteği**: 6-12 aylık yatırım getirisini öngörme
- **Kullanım**: Portfolio optimizasyonu

### 2. Kadın Girişimci Bütçesi (M)
- **Formül**: `ciro × 0.72`
- **Karar Desteği**: Çeşitlilik hedeflerine uygun bütçe planlama
- **Kullanım**: Sosyal sorumluluk stratejisi

### 3. Sürdürülebilirlik Uyum Puanı (Top 7)
- **Kaynak**: `firma_tahminleme.surdurulebilirlik_uyum_puani`
- **Karar Desteği**: Çevresel kriterlere en uyumlu firmaları belirleme
- **Kullanım**: Yeşil yatırım kararları

### 4. Atık Geri Dönüşüm Oranı (Top 10)
- **Formül**: `atik_miktari × (geri_donusum_orani / 100)`
- **Karar Desteği**: Döngüsel ekonomi performansını ölçme
- **Kullanım**: Kaynak verimliliği değerlendirmesi

### 5. Girişimci Uyumluluk Analizi (Top 10)
- **Parametrik DSS**: Slider değişikliklerinde anında yeniden hesaplama
- **Karar Desteği**: Farklı stratejik önceliklere göre girişimci değerlendirme
- **Kullanım**: Yatırım/ortaklık kararları için senaryo analizi

## Deployment

### Vercel

1. GitHub'a push yapın
2. Vercel'de projeyi import edin
3. Environment variables ekleyin
4. Deploy

```bash
# Vercel CLI ile deployment
npx vercel --prod
```

## Geliştirici Notları

- Tüm grafikler client-side render edilir (`<ClientOnly>`)
- Chart.js instance'ları düzgün şekilde destroy edilir (memory leak önleme)
- DSS parametreleri debounce ile güncellenir (300ms)
- API route'ları thin handler pattern'i kullanır

## Lisans

Bu proje eğitim amaçlıdır.
