import { getTop10Recycling } from '../../controllers/recyclingController.js'

/**
 * API Route: GET /api/dashboard/recycling-top10
 * Returns Top 10 firms by waste recycling efficiency
 * Response: { ok: true, data: { labels, values, firms } }
 */
export default defineEventHandler(async (event) => {
    try {
        const data = await getTop10Recycling()
        return {
            ok: true,
            data: data || { labels: [], values: [], firms: [] }
        }
    } catch (error) {
        console.error('[/api/dashboard/recycling-top10] Error:', error)
        return {
            ok: false,
            error: error.message || 'Geri dönüşüm verileri yüklenirken hata oluştu',
            where: '/api/dashboard/recycling-top10'
        }
    }
})
