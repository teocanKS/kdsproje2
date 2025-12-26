import { queryFirmById, queryLatestTahminleme, queryAyarlar } from '../db/supabase.js'

// Maximum money value in TL (999M)
const MAX_MONEY_TL = 999_000_000

/**
 * Clamp money value to max 999M TL
 */
function clampMoney(value) {
    if (value === null || value === undefined || isNaN(value)) return 0
    return Math.min(Math.max(0, value), MAX_MONEY_TL)
}

/**
 * Controller: Get KPI data for selected firm
 * 
 * KPIs:
 * 1) Tahmini Getiri (M) - from firma_tahminleme.tahmini_getiri (latest record)
 * 2) Kadın Girişimci Bütçesi (M) - calculated as tahmini_getiri * ayarlar.butce_yuzdesi (0.72)
 * 
 * CORRECTED FORMULA: kadin_girisimci_butcesi = tahmini_getiri * 0.72
 * (NOT ciro * 0.72)
 * 
 * All money values capped at 999M TL
 */
export async function getKpisForFirm(firmaId) {
    // Fetch settings for butce_yuzdesi
    let ayarlar = { butce_yuzdesi: 0.72 }
    try {
        ayarlar = await queryAyarlar()
    } catch (e) {
        console.error('[kpiController] Error fetching ayarlar:', e)
    }
    const butceYuzdesi = ayarlar?.butce_yuzdesi || 0.72

    if (!firmaId) {
        return {
            tahminiGetiri: 0,
            kadinGirisimciBütcesi: 0,
            firmaAdi: null,
            butceYuzdesi,
            hesapKontrol: false
        }
    }

    // Fetch firm details
    let firma = null
    try {
        firma = await queryFirmById(firmaId)
    } catch (e) {
        console.error('[kpiController] Error fetching firm:', e)
    }

    if (!firma) {
        return {
            tahminiGetiri: 0,
            kadinGirisimciBütcesi: 0,
            firmaAdi: null,
            butceYuzdesi,
            hesapKontrol: false
        }
    }

    // Fetch latest tahminleme record
    let tahminiGetiri = 0
    try {
        const tahminleme = await queryLatestTahminleme(firmaId)
        if (tahminleme) {
            // Clamp to max 999M
            tahminiGetiri = clampMoney(tahminleme.tahmini_getiri || 0)
        }
    } catch (e) {
        console.error('[kpiController] Error fetching tahminleme:', e)
        tahminiGetiri = 0
    }

    // CORRECTED FORMULA: Kadın Girişimci Bütçesi = tahmini_getiri * butce_yuzdesi
    // Previously used ciro * 0.72 - NOW using tahmini_getiri * 0.72
    const kadinGirisimciBütcesi = clampMoney(tahminiGetiri * butceYuzdesi)

    // Check for edge cases
    const hesapKontrol = (
        kadinGirisimciBütcesi > tahminiGetiri ||
        isNaN(kadinGirisimciBütcesi) ||
        isNaN(tahminiGetiri)
    )

    return {
        tahminiGetiri,
        kadinGirisimciBütcesi,
        firmaAdi: firma.ad || null,
        butceYuzdesi,
        hesapKontrol
    }
}
