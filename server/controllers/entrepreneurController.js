import { queryGirisimciler } from '../db/supabase.js'

/**
 * Controller: Get Top 10 entrepreneurs by parametric DSS scoring
 * 
 * This is the CORE DSS functionality - scenario simulation.
 * When parameters change, rankings change instantly.
 * 
 * Input Parameters (reference values for comparison):
 * - ref_kadin_orani: Target women employee ratio (0-100)
 * - ref_engelli_orani: Target disabled employee ratio (0-100)
 * - ref_min_kurulus_yili: Minimum establishment year
 * 
 * Scoring Columns Used:
 * - kadin_calisan_orani
 * - engelli_calisan_orani
 * - kurulus_yili
 * 
 * NOT Used in Scoring (display only):
 * - isletme_adi (label)
 * - talep_edilen_butce
 * - durum
 * - olusturulma_tarihi
 * 
 * DSS Scoring Formula (normalized, max 1.0):
 * score = 
 *   (kadin >= ref_kadin ? 1 : kadin / ref_kadin) * 0.4
 * + (engelli >= ref_engelli ? 1 : engelli / ref_engelli) * 0.3
 * + (kurulus_yili >= ref_min_kurulus_yili ? 1 : 0) * 0.3
 * 
 * Decision Support Context:
 * - Helps managers evaluate entrepreneurs for investment/partnership
 * - Parametric sliders allow what-if scenario analysis
 * - Rankings update instantly for different strategy priorities
 */
export async function getTop10Entrepreneurs(refKadin, refEngelli, refMinYil) {
    const girisimciler = await queryGirisimciler()

    // Handle empty or null data
    if (!girisimciler || !Array.isArray(girisimciler)) {
        return {
            labels: [],
            values: [],
            girisimciler: [],
            parameters: { refKadin, refEngelli, refMinYil }
        }
    }

    // Apply DSS scoring algorithm
    const scored = girisimciler.map(g => {
        if (!g) return null
        const kadinOrani = g.kadin_calisan_orani || 0
        const engelliOrani = g.engelli_calisan_orani || 0
        const kurulusYili = g.kurulus_yili || 0

        // Score component 1: Women employee ratio (40% weight)
        let kadinScore = 0
        if (refKadin > 0) {
            kadinScore = kadinOrani >= refKadin ? 1 : kadinOrani / refKadin
        }

        // Score component 2: Disabled employee ratio (30% weight)
        let engelliScore = 0
        if (refEngelli > 0) {
            engelliScore = engelliOrani >= refEngelli ? 1 : engelliOrani / refEngelli
        }

        // Score component 3: Establishment year (30% weight)
        const yilScore = kurulusYili >= refMinYil ? 1 : 0

        // Weighted total score
        const totalScore = (kadinScore * 0.4) + (engelliScore * 0.3) + (yilScore * 0.3)

        return {
            id: g.id,
            isletmeAdi: g.isletme_adi || 'Bilinmeyen',
            kadinOrani,
            engelliOrani,
            kurulusYili,
            score: totalScore,
            scoreBreakdown: {
                kadinScore: kadinScore * 0.4,
                engelliScore: engelliScore * 0.3,
                yilScore: yilScore * 0.3
            }
        }
    }).filter(g => g !== null)

    // Sort by score descending and take top 10
    const sorted = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

    return {
        labels: sorted.map(g => g.isletmeAdi),
        values: sorted.map(g => g.score),
        girisimciler: sorted,
        parameters: {
            refKadin,
            refEngelli,
            refMinYil
        }
    }
}
