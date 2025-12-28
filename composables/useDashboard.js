/**
 * Composable: useDashboard
 * 
 * Centralized state management and data fetching for the KDS dashboard.
 * Provides reactive state for all dashboard components.
 */
export function useDashboard() {
    // Selected firm state
    const selectedFirmaId = useState('selectedFirmaId', () => null)

    // DSS parameter state for entrepreneur scoring
    const dssParams = useState('dssParams', () => ({
        refKadin: 30,
        refEngelli: 5,
        refMinYil: 2015
    }))

    // Loading states
    const loading = useState('dashboardLoading', () => ({
        firms: false,
        kpis: false,
        sustainability: false,
        recycling: false,
        entrepreneur: false,
        allReturns: false
    }))

    // Error states
    const errors = useState('dashboardErrors', () => ({
        firms: null,
        kpis: null,
        sustainability: null,
        recycling: null,
        entrepreneur: null,
        allReturns: null
    }))

    // Data states
    const firms = useState('firms', () => [])
    const kpis = useState('kpis', () => ({
        tahminiGetiri: 0,
        kadinGirisimciBütcesi: 0,
        firmaAdi: null
    }))
    const sustainabilityData = useState('sustainabilityData', () => null)
    const recyclingData = useState('recyclingData', () => null)
    const entrepreneurData = useState('entrepreneurData', () => null)
    const allReturnsData = useState('allReturnsData', () => null)

    // Fetch firms for dropdown
    async function fetchFirms() {
        loading.value.firms = true
        errors.value.firms = null
        try {
            const response = await $fetch('/api/firms')
            if (response.ok) {
                firms.value = response.data || []
            } else {
                errors.value.firms = response.error || 'Firmalar yüklenemedi'
                console.error('[fetchFirms] API error:', response.error)
            }
        } catch (error) {
            errors.value.firms = error.message || 'Firmalar yüklenirken bağlantı hatası'
            console.error('[fetchFirms] Error:', error)
        } finally {
            loading.value.firms = false
        }
    }

    // Fetch KPIs for selected firm
    async function fetchKpis() {
        loading.value.kpis = true
        errors.value.kpis = null
        try {
            const url = selectedFirmaId.value
                ? `/api/dashboard/kpis?firma_id=${selectedFirmaId.value}`
                : '/api/dashboard/kpis'
            const response = await $fetch(url)
            if (response.ok) {
                kpis.value = response.data || { tahminiGetiri: 0, kadinGirisimciBütcesi: 0, firmaAdi: null }
            } else {
                errors.value.kpis = response.error || 'KPI verileri yüklenemedi'
                console.error('[fetchKpis] API error:', response.error)
            }
        } catch (error) {
            errors.value.kpis = error.message || 'KPI verileri yüklenirken bağlantı hatası'
            console.error('[fetchKpis] Error:', error)
        } finally {
            loading.value.kpis = false
        }
    }

    // Fetch all firms returns for line charts
    async function fetchAllReturns() {
        loading.value.allReturns = true
        errors.value.allReturns = null
        try {
            const response = await $fetch('/api/dashboard/all-returns')
            if (response.ok) {
                allReturnsData.value = response.data || { firms: [], butceYuzdesi: 0.72 }
            } else {
                errors.value.allReturns = response.error || 'Getiri verileri yüklenemedi'
                allReturnsData.value = { firms: [], butceYuzdesi: 0.72 }
                console.error('[fetchAllReturns] API error:', response.error)
            }
        } catch (error) {
            errors.value.allReturns = error.message || 'Getiri verileri yüklenirken bağlantı hatası'
            allReturnsData.value = { firms: [], butceYuzdesi: 0.72 }
            console.error('[fetchAllReturns] Error:', error)
        } finally {
            loading.value.allReturns = false
        }
    }

    // Fetch sustainability Top 7 data
    async function fetchSustainability() {
        loading.value.sustainability = true
        errors.value.sustainability = null
        try {
            const response = await $fetch('/api/dashboard/sustainability-top7')
            if (response.ok) {
                sustainabilityData.value = response.data || { labels: [], values: [], firms: [] }
            } else {
                errors.value.sustainability = response.error || 'Sürdürülebilirlik verileri yüklenemedi'
                sustainabilityData.value = { labels: [], values: [], firms: [] }
                console.error('[fetchSustainability] API error:', response.error)
            }
        } catch (error) {
            errors.value.sustainability = error.message || 'Sürdürülebilirlik verileri yüklenirken bağlantı hatası'
            sustainabilityData.value = { labels: [], values: [], firms: [] }
            console.error('[fetchSustainability] Error:', error)
        } finally {
            loading.value.sustainability = false
        }
    }

    // Fetch recycling Top 10 data
    async function fetchRecycling() {
        loading.value.recycling = true
        errors.value.recycling = null
        try {
            const response = await $fetch('/api/dashboard/recycling-top10')
            if (response.ok) {
                recyclingData.value = response.data || { labels: [], values: [], firms: [] }
            } else {
                errors.value.recycling = response.error || 'Geri dönüşüm verileri yüklenemedi'
                recyclingData.value = { labels: [], values: [], firms: [] }
                console.error('[fetchRecycling] API error:', response.error)
            }
        } catch (error) {
            errors.value.recycling = error.message || 'Geri dönüşüm verileri yüklenirken bağlantı hatası'
            recyclingData.value = { labels: [], values: [], firms: [] }
            console.error('[fetchRecycling] Error:', error)
        } finally {
            loading.value.recycling = false
        }
    }

    // Fetch entrepreneur Top 10 data with DSS parameters
    async function fetchEntrepreneurs() {
        loading.value.entrepreneur = true
        errors.value.entrepreneur = null
        try {
            const params = new URLSearchParams({
                ref_kadin: dssParams.value.refKadin.toString(),
                ref_engelli: dssParams.value.refEngelli.toString(),
                ref_min_yil: dssParams.value.refMinYil.toString()
            })
            const response = await $fetch(`/api/dashboard/entrepreneur-top10?${params}`)
            if (response.ok) {
                entrepreneurData.value = response.data || { labels: [], values: [], girisimciler: [], parameters: {} }
            } else {
                errors.value.entrepreneur = response.error || 'Girişimci verileri yüklenemedi'
                entrepreneurData.value = { labels: [], values: [], girisimciler: [], parameters: {} }
                console.error('[fetchEntrepreneurs] API error:', response.error)
            }
        } catch (error) {
            errors.value.entrepreneur = error.message || 'Girişimci verileri yüklenirken bağlantı hatası'
            entrepreneurData.value = { labels: [], values: [], girisimciler: [], parameters: {} }
            console.error('[fetchEntrepreneurs] Error:', error)
        } finally {
            loading.value.entrepreneur = false
        }
    }

    // Initialize all dashboard data
    async function initDashboard() {
        await Promise.all([
            fetchFirms(),
            fetchKpis(),
            fetchAllReturns(),
            fetchSustainability(),
            fetchRecycling(),
            fetchEntrepreneurs()
        ])
    }

    // Select a firm and refresh KPIs
    function selectFirm(firmaId) {
        selectedFirmaId.value = firmaId
        fetchKpis()
    }

    // Update DSS parameters and refresh entrepreneur data
    function updateDssParams(params) {
        dssParams.value = { ...dssParams.value, ...params }
        fetchEntrepreneurs()
    }

    return {
        // State
        selectedFirmaId,
        dssParams,
        loading,
        errors,
        firms,
        kpis,
        sustainabilityData,
        recyclingData,
        entrepreneurData,
        allReturnsData,

        // Actions
        fetchFirms,
        fetchKpis,
        fetchAllReturns,
        fetchSustainability,
        fetchRecycling,
        fetchEntrepreneurs,
        initDashboard,
        selectFirm,
        updateDssParams
    }
}
