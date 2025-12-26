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
        entrepreneur: false
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

    // Fetch firms for dropdown
    async function fetchFirms() {
        loading.value.firms = true
        try {
            const response = await $fetch('/api/firms')
            if (response.success) {
                firms.value = response.data
            }
        } catch (error) {
            console.error('Error fetching firms:', error)
        } finally {
            loading.value.firms = false
        }
    }

    // Fetch KPIs for selected firm
    async function fetchKpis() {
        loading.value.kpis = true
        try {
            const url = selectedFirmaId.value
                ? `/api/dashboard/kpis?firma_id=${selectedFirmaId.value}`
                : '/api/dashboard/kpis'
            const response = await $fetch(url)
            if (response.success) {
                kpis.value = response.data
            }
        } catch (error) {
            console.error('Error fetching KPIs:', error)
        } finally {
            loading.value.kpis = false
        }
    }

    // Fetch sustainability Top 7 data
    async function fetchSustainability() {
        loading.value.sustainability = true
        try {
            const response = await $fetch('/api/dashboard/sustainability-top7')
            if (response.success) {
                sustainabilityData.value = response.data
            }
        } catch (error) {
            console.error('Error fetching sustainability data:', error)
        } finally {
            loading.value.sustainability = false
        }
    }

    // Fetch recycling Top 10 data
    async function fetchRecycling() {
        loading.value.recycling = true
        try {
            const response = await $fetch('/api/dashboard/recycling-top10')
            if (response.success) {
                recyclingData.value = response.data
            }
        } catch (error) {
            console.error('Error fetching recycling data:', error)
        } finally {
            loading.value.recycling = false
        }
    }

    // Fetch entrepreneur Top 10 data with DSS parameters
    async function fetchEntrepreneurs() {
        loading.value.entrepreneur = true
        try {
            const params = new URLSearchParams({
                ref_kadin: dssParams.value.refKadin.toString(),
                ref_engelli: dssParams.value.refEngelli.toString(),
                ref_min_yil: dssParams.value.refMinYil.toString()
            })
            const response = await $fetch(`/api/dashboard/entrepreneur-top10?${params}`)
            if (response.success) {
                entrepreneurData.value = response.data
            }
        } catch (error) {
            console.error('Error fetching entrepreneur data:', error)
        } finally {
            loading.value.entrepreneur = false
        }
    }

    // Initialize all dashboard data
    async function initDashboard() {
        await Promise.all([
            fetchFirms(),
            fetchKpis(),
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
        firms,
        kpis,
        sustainabilityData,
        recyclingData,
        entrepreneurData,

        // Actions
        fetchFirms,
        fetchKpis,
        fetchSustainability,
        fetchRecycling,
        fetchEntrepreneurs,
        initDashboard,
        selectFirm,
        updateDssParams
    }
}
