import { queryFirmsWithLatestTahminleme } from '../db/supabase.js'

/**
 * Controller: Get Top 7 firms by sustainability compliance score
 * 
 * Data Source: firma_tahminleme.surdurulebilirlik_uyum_puani
 * Uses ONLY the latest tahminleme record for each firm.
 * 
 * Decision Support Context:
 * - Helps managers identify which firms are leading in sustainability
 * - Supports portfolio decisions for 6-12 month investment horizons
 * - Higher scores indicate better alignment with sustainability goals
 */
export async function getTop7Sustainability() {
    const firmsWithScores = await queryFirmsWithLatestTahminleme()

    // Handle empty or null data
    if (!firmsWithScores || !Array.isArray(firmsWithScores)) {
        return { labels: [], values: [], firms: [] }
    }

    // Sort by sustainability score descending
    const sorted = firmsWithScores
        .filter(f => f && (f.surdurulebilirlik_uyum_puani || 0) > 0)
        .sort((a, b) => (b.surdurulebilirlik_uyum_puani || 0) - (a.surdurulebilirlik_uyum_puani || 0))
        .slice(0, 7)

    return {
        labels: sorted.map(f => f.ad || 'Bilinmeyen'),
        values: sorted.map(f => f.surdurulebilirlik_uyum_puani || 0),
        firms: sorted.map(f => ({
            id: f.id,
            ad: f.ad || 'Bilinmeyen',
            puan: f.surdurulebilirlik_uyum_puani || 0
        }))
    }
}
