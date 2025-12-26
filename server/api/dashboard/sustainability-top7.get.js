import { getTop7Sustainability } from '../../controllers/sustainabilityController.js'

/**
 * API Route: GET /api/dashboard/sustainability-top7
 * Returns Top 7 firms by sustainability compliance score
 */
export default defineEventHandler(async (event) => {
    try {
        const data = await getTop7Sustainability()
        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('Error fetching sustainability data:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Sürdürülebilirlik verileri yüklenirken hata oluştu'
        })
    }
})
