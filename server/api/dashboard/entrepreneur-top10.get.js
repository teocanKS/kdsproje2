import { getTop10Entrepreneurs } from '../../controllers/entrepreneurController.js'

/**
 * API Route: GET /api/dashboard/entrepreneur-top10
 * Query params:
 *   - ref_kadin: Reference women employee ratio (default: 30)
 *   - ref_engelli: Reference disabled employee ratio (default: 5)
 *   - ref_min_yil: Minimum establishment year (default: 2015)
 * 
 * This is the parametric DSS endpoint - when parameters change, rankings change.
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
            throw createError({
                statusCode: 400,
                statusMessage: 'ref_kadin değeri 0-100 arasında olmalıdır'
            })
        }

        if (refEngelli < 0 || refEngelli > 100) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ref_engelli değeri 0-100 arasında olmalıdır'
            })
        }

        if (refMinYil < 1900 || refMinYil > new Date().getFullYear()) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ref_min_yil geçersiz değer'
            })
        }

        const data = await getTop10Entrepreneurs(refKadin, refEngelli, refMinYil)
        return {
            success: true,
            data
        }
    } catch (error) {
        console.error('Error fetching entrepreneur data:', error)
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: 'Girişimci verileri yüklenirken hata oluştu'
        })
    }
})
