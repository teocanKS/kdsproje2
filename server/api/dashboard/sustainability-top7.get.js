import { getTop7Sustainability } from '../../controllers/sustainabilityController.js'

/**
 * API Route: GET /api/dashboard/sustainability-top7
 * Returns Top 7 firms by sustainability compliance score
 * Response: { ok: true, data: { labels, values, firms } }
 */
export default defineEventHandler(async (event) => {
    try {
        const data = await getTop7Sustainability()
        return {
            ok: true,
            data: data || { labels: [], values: [], firms: [] }
        }
    } catch (error) {
        console.error('[/api/dashboard/sustainability-top7] Error:', error)
        return {
            ok: false,
            error: error.message || 'Sürdürülebilirlik verileri yüklenirken hata oluştu',
            where: '/api/dashboard/sustainability-top7'
        }
    }
})
