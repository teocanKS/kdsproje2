import { getTop10Recycling } from '../../controllers/recyclingController.js'

/**
 * API Route: GET /api/dashboard/recycling-top10
 * Returns Top 10 firms by waste recycling efficiency
 */
export default defineEventHandler(async (event) => {
    try {
        const data = await getTop10Recycling()
        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('Error fetching recycling data:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Geri dönüşüm verileri yüklenirken hata oluştu'
        })
    }
})
