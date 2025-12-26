import { getAllFirms } from '../controllers/firmsController.js'

/**
 * API Route: GET /api/firms
 * Returns list of all firms for dropdown selection
 * Response: { ok: true, data: [{ id, ad }, ...] }
 */
export default defineEventHandler(async (event) => {
    try {
        const firms = await getAllFirms()
        return {
            ok: true,
            data: firms || []
        }
    } catch (error) {
        console.error('[/api/firms] Error:', error)
        return {
            ok: false,
            error: error.message || 'Firmalar yüklenirken hata oluştu',
            where: '/api/firms'
        }
    }
})
