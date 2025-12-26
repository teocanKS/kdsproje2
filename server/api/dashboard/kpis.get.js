import { getKpisForFirm } from '../../controllers/kpiController.js'

/**
 * API Route: GET /api/dashboard/kpis
 * Query params: firma_id (optional)
 * Returns KPI values for selected firm
 * Response: { ok: true, data: { tahminiGetiri, kadinGirisimciBütcesi, firmaAdi } }
 */
export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const firmaId = query.firma_id ? parseInt(query.firma_id, 10) : null

        // Validate firma_id if provided
        if (query.firma_id && (isNaN(firmaId) || firmaId <= 0)) {
            return {
                ok: false,
                error: 'Geçersiz firma ID',
                where: '/api/dashboard/kpis'
            }
        }

        const kpis = await getKpisForFirm(firmaId)
        return {
            ok: true,
            data: kpis || { tahminiGetiri: 0, kadinGirisimciBütcesi: 0, firmaAdi: null }
        }
    } catch (error) {
        console.error('[/api/dashboard/kpis] Error:', error)
        return {
            ok: false,
            error: error.message || 'KPI verileri yüklenirken hata oluştu',
            where: '/api/dashboard/kpis'
        }
    }
})
