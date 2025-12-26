import { getTop10Entrepreneurs } from '../../controllers/entrepreneurController.js'

/**
 * API Route: GET /api/dashboard/entrepreneur-top10
 * Query params:
 *   - ref_kadin: Reference women employee ratio (default: 30)
 *   - ref_engelli: Reference disabled employee ratio (default: 5)
 *   - ref_min_yil: Minimum establishment year (default: 2015)
 * 
 * This is the parametric DSS endpoint - when parameters change, rankings change.
 * Response: { ok: true, data: { labels, values, girisimciler, parameters } }
 */
export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)

        // Parse and validate parameters with defaults
        const refKadin = parseFloat(query.ref_kadin) || 30
        const refEngelli = parseFloat(query.ref_engelli) || 5
        const refMinYil = parseInt(query.ref_min_yil, 10) || 2015

        // Validate ranges
        if (refKadin < 0 || refKadin > 100) {
            return {
                ok: false,
                error: 'ref_kadin değeri 0-100 arasında olmalıdır',
                where: '/api/dashboard/entrepreneur-top10'
            }
        }

        if (refEngelli < 0 || refEngelli > 100) {
            return {
                ok: false,
                error: 'ref_engelli değeri 0-100 arasında olmalıdır',
                where: '/api/dashboard/entrepreneur-top10'
            }
        }

        if (refMinYil < 1900 || refMinYil > new Date().getFullYear()) {
            return {
                ok: false,
                error: 'ref_min_yil geçersiz değer',
                where: '/api/dashboard/entrepreneur-top10'
            }
        }

        const data = await getTop10Entrepreneurs(refKadin, refEngelli, refMinYil)
        return {
            ok: true,
            data: data || { labels: [], values: [], girisimciler: [], parameters: { refKadin, refEngelli, refMinYil } }
        }
    } catch (error) {
        console.error('[/api/dashboard/entrepreneur-top10] Error:', error)
        return {
            ok: false,
            error: error.message || 'Girişimci verileri yüklenirken hata oluştu',
            where: '/api/dashboard/entrepreneur-top10'
        }
    }
})
