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
 * Returns:
 * - labels: top 10 firm names
 * - values: top 10 recovered waste values
 * - firms: top 10 firm objects with details
 * - allFirms: ALL firms with their data (for lookup by selected firm)
 */
export async function getTop10Recycling() {
    const firms = await queryFirmsWithRecycling()

    // Handle empty or null data
    if (!firms || !Array.isArray(firms)) {
        return { labels: [], values: [], firms: [], allFirms: [] }
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

    // Sort by recovered waste descending (ALL firms)
    const sorted = firmsWithCalc
        .sort((a, b) => b.geriKazanilanAtik - a.geriKazanilanAtik)

    // Assign rank to each firm
    const allFirmsWithRank = sorted.map((f, index) => ({
        ...f,
        rank: index + 1
    }))

    // Top 10 for charts (filter > 0)
    const top10 = allFirmsWithRank
        .filter(f => f.geriKazanilanAtik > 0)
        .slice(0, 10)

    return {
        labels: top10.map(f => f.ad),
        values: top10.map(f => f.geriKazanilanAtik),
        firms: top10,
        allFirms: allFirmsWithRank
    }
}
