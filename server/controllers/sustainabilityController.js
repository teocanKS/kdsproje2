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

    // Sort by sustainability score descending
    const sorted = firmsWithScores
        .filter(f => f.surdurulebilirlik_uyum_puani > 0)
        .sort((a, b) => b.surdurulebilirlik_uyum_puani - a.surdurulebilirlik_uyum_puani)
        .slice(0, 7)

    return {
        labels: sorted.map(f => f.ad),
        values: sorted.map(f => f.surdurulebilirlik_uyum_puani),
        firms: sorted.map(f => ({
            id: f.id,
            ad: f.ad,
            puan: f.surdurulebilirlik_uyum_puani
        }))
    }
}
