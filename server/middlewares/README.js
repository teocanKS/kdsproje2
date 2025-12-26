/**
 * Server Middlewares
 * 
 * Bu klasör opsiyonel server middleware'leri için ayrılmıştır.
 * Nuxt 3'te server middleware'ler her request'ten önce çalışır.
 * 
 * Örnek kullanım alanları:
 * - Request logging
 * - CORS handling (Nuxt bunu otomatik yönetir)
 * - Authentication checks
 * - Rate limiting
 * 
 * Bu projede middleware kullanılmamaktadır çünkü:
 * - Supabase authentication anon key ile sağlanıyor
 * - CORS Vercel tarafından yönetiliyor
 * - Basit API route'ları için middleware gereksiz karmaşıklık ekler
 */

export default {}
