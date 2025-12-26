// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },

    modules: [
        '@nuxtjs/tailwindcss'
    ],

    runtimeConfig: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    },

    app: {
        head: {
            title: 'KDS - Karar Destek Sistemi',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Sürdürülebilirlik Karar Destek Sistemi - 6-12 Aylık Stratejik Planlama' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ]
        }
    },

    compatibilityDate: '2024-12-26'
})
