import { queryFirmsWithRecycling } from '../db/supabase.js'

/**
 * Controller: Get Top 10 firms by waste recycling efficiency
 * 
 * DSS Algorithm:
 * geri_kazanilan_atik = atik_miktari * (geri_donusum_orani / 100)
 * 
 * Data Sources:
 * - firmalar.atik_miktari: Total waste produced (tons)
 * - firmalar.geri_donusum_orani: Recycling rate (percentage)
 * 
 * Decision Support Context:
 * - Identifies firms with best recycling performance
 * - Supports circular economy investment decisions
 * - Higher recovered waste indicates better resource efficiency
 */
export async function getTop10Recycling() {
    const firms = await queryFirmsWithRecycling()

    // Handle empty or null data
    if (!firms || !Array.isArray(firms)) {
        return { labels: [], values: [], firms: [] }
    }

    // Calculate recovered waste for each firm
    const firmsWithCalc = firms.map(f => {
        if (!f) return null
        const atikMiktari = f.atik_miktari || 0
        const geriDonusumOrani = f.geri_donusum_orani || 0
        const geriKazanilanAtik = atikMiktari * (geriDonusumOrani / 100)

        return {
            id: f.id,
            ad: f.ad || 'Bilinmeyen',
            atikMiktari,
            geriDonusumOrani,
            geriKazanilanAtik
        }
    }).filter(f => f !== null)

    // Sort by recovered waste descending and take top 10
    const sorted = firmsWithCalc
        .filter(f => f.geriKazanilanAtik > 0)
        .sort((a, b) => b.geriKazanilanAtik - a.geriKazanilanAtik)
        .slice(0, 10)

    return {
        labels: sorted.map(f => f.ad),
        values: sorted.map(f => f.geriKazanilanAtik),
        firms: sorted.map(f => ({
            id: f.id,
            ad: f.ad,
            atikMiktari: f.atikMiktari,
            geriDonusumOrani: f.geriDonusumOrani,
            geriKazanilanAtik: f.geriKazanilanAtik
        }))
    }
}
