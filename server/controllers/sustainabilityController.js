import { queryFirmsWithLatestTahminleme } from '../db/supabase.js'

/**
 * Controller: Get Top 7 firms by sustainability compliance score
 * 
 * Data Source: firma_tahminleme.surdurulebilirlik_uyum_puani
 * Uses ONLY the latest tahminleme record for each firm.
 * 
 * Returns:
 * - labels: top 7 firm names
 * - values: top 7 scores
 * - firms: top 7 firm objects
 * - allFirms: ALL firms with their score and rank (for lookup)
 */
export async function getTop7Sustainability() {
    const firmsWithScores = await queryFirmsWithLatestTahminleme()

    // Handle empty or null data
    if (!firmsWithScores || !Array.isArray(firmsWithScores)) {
        return { labels: [], values: [], firms: [], allFirms: [] }
    }

    // Sort ALL firms by sustainability score descending
    const sorted = firmsWithScores
        .filter(f => f !== null && f !== undefined)
        .sort((a, b) => (b.surdurulebilirlik_uyum_puani || 0) - (a.surdurulebilirlik_uyum_puani || 0))

    // Assign rank to each firm (1-based)
    const allFirmsWithRank = sorted.map((f, index) => ({
        id: f.id,
        ad: f.ad || 'Bilinmeyen',
        puan: f.surdurulebilirlik_uyum_puani || 0,
        rank: index + 1
    }))

    // Top 7 for charts (filter score > 0)
    const top7 = allFirmsWithRank
        .filter(f => f.puan > 0)
        .slice(0, 7)

    return {
        labels: top7.map(f => f.ad),
        values: top7.map(f => f.puan),
        firms: top7,
        allFirms: allFirmsWithRank
    }
}
