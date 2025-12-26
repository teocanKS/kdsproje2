import { queryGirisimciler } from '../db/supabase.js'

/**
 * Normalize ratio to 0-1 scale
 * Handles both 0-1 and 0-100 formats
 */
function toRatio01(x) {
    if (x === null || x === undefined || isNaN(x)) return 0
    if (x > 1.5) return x / 100
    return x
}

/**
 * Controller: Get Top 10 entrepreneurs by parametric DSS scoring
 * 
 * This is the CORE DSS functionality - scenario simulation.
 * When parameters change, rankings change instantly.
 * 
 * NEW SCORING FORMULA (creates variation when sliders move):
 * 
 * kadinScore = max(0, 1 - abs(kadin - refKadin) / max(refKadin, 0.01))
 * engelliScore = max(0, 1 - abs(engelli - refEngelli) / max(refEngelli, 0.01))
 * yearScore = kurulus_yili >= refMinYear ? 1 : max(0, 1 - (refMinYear - kurulus_yili) / 10)
 * 
 * finalScore = kadinScore * 0.4 + engelliScore * 0.3 + yearScore * 0.3
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

    // Normalize reference values to 0-1 scale
    const refKadinNorm = toRatio01(refKadin)
    const refEngelliNorm = toRatio01(refEngelli)

    // Apply DSS scoring algorithm with NEW formula
    const scored = girisimciler.map(g => {
        if (!g) return null

        // Normalize DB values to 0-1 scale
        const kadinOrani = toRatio01(g.kadin_calisan_orani)
        const engelliOrani = toRatio01(g.engelli_calisan_orani)
        const kurulusYili = g.kurulus_yili || 0

        // NEW SCORING: Proximity-based (closer to ref = higher score)
        // kadinScore = max(0, 1 - abs(kadin - refKadin) / max(refKadin, 0.01))
        let kadinScore = 0
        if (refKadinNorm > 0.001) {
            const diff = Math.abs(kadinOrani - refKadinNorm)
            kadinScore = Math.max(0, 1 - diff / Math.max(refKadinNorm, 0.01))
        } else {
            // If ref is 0, score by how low the ratio is
            kadinScore = 1 - kadinOrani
        }

        // engelliScore = max(0, 1 - abs(engelli - refEngelli) / max(refEngelli, 0.01))
        let engelliScore = 0
        if (refEngelliNorm > 0.001) {
            const diff = Math.abs(engelliOrani - refEngelliNorm)
            engelliScore = Math.max(0, 1 - diff / Math.max(refEngelliNorm, 0.01))
        } else {
            engelliScore = 1 - engelliOrani
        }

        // yearScore = kurulus_yili >= refMinYear ? 1 : max(0, 1 - (refMinYear - kurulus_yili) / 10)
        let yilScore = 0
        if (kurulusYili >= refMinYil) {
            yilScore = 1
        } else {
            yilScore = Math.max(0, 1 - (refMinYil - kurulusYili) / 10)
        }

        // Weighted total score
        const totalScore = (kadinScore * 0.4) + (engelliScore * 0.3) + (yilScore * 0.3)

        return {
            id: g.id,
            isletmeAdi: g.isletme_adi || 'Bilinmeyen',
            // Store as percentages for display
            kadinOrani: (kadinOrani * 100).toFixed(1),
            engelliOrani: (engelliOrani * 100).toFixed(1),
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
