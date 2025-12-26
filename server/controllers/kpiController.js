import { queryFirmById, queryLatestTahminleme } from '../db/supabase.js'

/**
 * Controller: Get KPI data for selected firm
 * 
 * KPIs:
 * 1) Tahmini Getiri (M) - from firma_tahminleme.tahmini_getiri (latest record)
 * 2) Kadın Girişimci Bütçesi (M) - calculated as firmalar.ciro * 0.72
 * 
 * Decision Support Context:
 * - Tahmini Getiri helps managers forecast potential returns over 6-12 months
 * - Kadın Girişimci Bütçesi shows budget allocation aligned with diversity goals
 */
export async function getKpisForFirm(firmaId) {
    if (!firmaId) {
        return {
            tahminiGetiri: 0,
            kadinGirisimciBütcesi: 0,
            firmaAdi: null
        }
    }

    // Fetch firm details
    const firma = await queryFirmById(firmaId)
    if (!firma) {
        throw new Error('Firma bulunamadı')
    }

    // Fetch latest tahminleme record
    let tahminiGetiri = 0
    try {
        const tahminleme = await queryLatestTahminleme(firmaId)
        if (tahminleme) {
            tahminiGetiri = tahminleme.tahmini_getiri || 0
        }
    } catch (e) {
        // No tahminleme record exists for this firm
        tahminiGetiri = 0
    }

    // Calculate Kadın Girişimci Bütçesi
    // Formula: ciro * 0.72 (72% allocation for women entrepreneur support)
    const ciro = firma.ciro || 0
    const kadinGirisimciBütcesi = ciro * 0.72

    return {
        tahminiGetiri,
        kadinGirisimciBütcesi,
        firmaAdi: firma.ad
    }
}
