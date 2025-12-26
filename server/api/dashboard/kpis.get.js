import { getKpisForFirm } from '../../controllers/kpiController.js'

/**
 * API Route: GET /api/dashboard/kpis
 * Query params: firma_id (optional)
 * Returns KPI values for selected firm
 */
export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const firmaId = query.firma_id ? parseInt(query.firma_id, 10) : null

        // Validate firma_id if provided
        if (query.firma_id && (isNaN(firmaId) || firmaId <= 0)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Geçersiz firma ID'
            })
        }

        const kpis = await getKpisForFirm(firmaId)
        return {
            success: true,
            data: kpis
        }
    } catch (error) {
        console.error('Error fetching KPIs:', error)
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: 'KPI verileri yüklenirken hata oluştu'
        })
    }
})
