import { getAllFirms } from '../controllers/firmsController.js'

/**
 * API Route: GET /api/firms
 * Returns list of all firms for dropdown selection
 * Response: [{ id, ad }, ...]
 */
export default defineEventHandler(async (event) => {
    try {
        const firms = await getAllFirms()
        return {
            success: true,
            data: firms
        }
    } catch (error) {
        console.error('Error fetching firms:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Firmalar yüklenirken hata oluştu'
        })
    }
})
