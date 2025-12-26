import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export function getSupabase() {
    if (supabaseInstance) {
        return supabaseInstance
    }

    const config = useRuntimeConfig()
    const supabaseUrl = config.supabaseUrl
    const supabaseAnonKey = config.supabaseAnonKey

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase credentials are not configured')
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
}

// Query helper: Get all firms for dropdown
export async function queryFirms() {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('firmalar')
        .select('id, ad')
        .order('ad', { ascending: true })

    if (error) throw error
    return data
}

// Query helper: Get firm details by ID
export async function queryFirmById(firmaId) {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('firmalar')
        .select('*')
        .eq('id', firmaId)
        .single()

    if (error) throw error
    return data
}

// Query helper: Get latest tahminleme for a firm
export async function queryLatestTahminleme(firmaId) {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('firma_tahminleme')
        .select('*')
        .eq('firma_id', firmaId)
        .order('olusturulma_tarihi', { ascending: false })
        .limit(1)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

// Query helper: Get all firms with their latest tahminleme
export async function queryFirmsWithLatestTahminleme() {
    const supabase = getSupabase()

    // First get all firms
    const { data: firmalar, error: firmalarError } = await supabase
        .from('firmalar')
        .select('id, ad')

    if (firmalarError) throw firmalarError

    // Then get all tahminleme records
    const { data: tahminlemeler, error: tahminError } = await supabase
        .from('firma_tahminleme')
        .select('firma_id, surdurulebilirlik_uyum_puani, olusturulma_tarihi')
        .order('olusturulma_tarihi', { ascending: false })

    if (tahminError) throw tahminError

    // Group by firma_id and get only the latest for each
    const latestByFirma = {}
    for (const t of tahminlemeler) {
        if (!latestByFirma[t.firma_id]) {
            latestByFirma[t.firma_id] = t
        }
    }

    return firmalar.map(firma => ({
        ...firma,
        surdurulebilirlik_uyum_puani: latestByFirma[firma.id]?.surdurulebilirlik_uyum_puani || 0
    }))
}

// Query helper: Get all firms with recycling data
export async function queryFirmsWithRecycling() {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('firmalar')
        .select('id, ad, atik_miktari, geri_donusum_orani')

    if (error) throw error
    return data
}

// Query helper: Get all entrepreneurs
export async function queryGirisimciler() {
    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('girisimciler')
        .select('id, isletme_adi, kadin_calisan_orani, engelli_calisan_orani, kurulus_yili')

    if (error) throw error
    return data
}
