/**
 * API Route: GET /api/health
 * Health check endpoint that verifies environment configuration
 */
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    return {
        ok: true,
        hasSupabaseUrl: Boolean(config.supabaseUrl),
        hasSupabaseAnonKey: Boolean(config.supabaseAnonKey),
        now: new Date().toISOString()
    }
})
