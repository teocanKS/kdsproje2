import { queryAyarlar } from '../../db/supabase.js'
import { getSupabase } from '../../db/supabase.js'

// Maximum money value in TL (999M)
const MAX_MONEY_TL = 999_000_000

function clampMoney(value) {
    if (value === null || value === undefined || isNaN(value)) return 0
    return Math.min(Math.max(0, value), MAX_MONEY_TL)
}

/**
 * API Endpoint: Get all firms with their latest tahmini_getiri
 * Used for the Estimated Return line chart (global view)
 */
export default defineEventHandler(async (event) => {
    try {
        const supabase = getSupabase()

        // Fetch ayarlar for butce_yuzdesi
        let butceYuzdesi = 0.72
        try {
            const ayarlar = await queryAyarlar()
            butceYuzdesi = ayarlar?.butce_yuzdesi || 0.72
        } catch (e) {
            console.error('[all-returns] Error fetching ayarlar:', e)
        }

        // Get all firms
        const { data: firmalar, error: firmalarError } = await supabase
            .from('firmalar')
            .select('id, ad')
            .order('ad', { ascending: true })

        if (firmalarError) throw firmalarError
        if (!firmalar || firmalar.length === 0) {
            return { ok: true, data: { firms: [], butceYuzdesi } }
        }

        // Get all tahminleme records
        const { data: tahminlemeler, error: tahminError } = await supabase
            .from('firma_tahminleme')
            .select('firma_id, tahmini_getiri, olusturulma_tarihi')
            .order('olusturulma_tarihi', { ascending: false })

        if (tahminError) throw tahminError

        // Group by firma_id and get only the latest for each
        const latestByFirma = {}
        if (tahminlemeler && Array.isArray(tahminlemeler)) {
            for (const t of tahminlemeler) {
                if (t && t.firma_id && !latestByFirma[t.firma_id]) {
                    latestByFirma[t.firma_id] = t
                }
            }
        }

        // Build result with clamped values
        const firms = firmalar.map(firma => {
            const tahmin = latestByFirma[firma.id]
            const tahminiGetiri = clampMoney(tahmin?.tahmini_getiri || 0)
            const kadinBudget = clampMoney(tahminiGetiri * butceYuzdesi)

            return {
                id: firma.id,
                ad: firma.ad || 'Bilinmeyen',
                tahminiGetiri,
                kadinBudget
            }
        })

        return {
            ok: true,
            data: {
                firms,
                butceYuzdesi
            }
        }
    } catch (error) {
        console.error('[/api/dashboard/all-returns] Error:', error)
        return {
            ok: false,
            error: error.message || 'Tüm firma getiri verileri yüklenirken hata oluştu',
            where: '/api/dashboard/all-returns'
        }
    }
})
