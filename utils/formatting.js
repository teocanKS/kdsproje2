/**
 * Shared formatting utilities for the KDS dashboard
 */

/**
 * Format a number in millions with TRY symbol
 * Example: 12500000 -> "₺12.5M"
 */
export function formatMillions(value) {
    if (value === null || value === undefined || isNaN(value)) return '₺0'
    const millions = value / 1_000_000
    if (millions >= 1) {
        return `₺${millions.toFixed(1)}M`
    }
    if (value >= 1000) {
        const thousands = value / 1000
        return `₺${thousands.toFixed(1)}K`
    }
    return `₺${value.toFixed(0)}`
}

/**
 * Format a percentage value
 * Example: 72.5 -> "72.5%"
 */
export function formatPercentage(value) {
    if (value === null || value === undefined || isNaN(value)) return '0%'
    return `${value.toFixed(1)}%`
}

/**
 * Format a score value (0-1 range)
 * Example: 0.85 -> "0.85"
 */
export function formatScore(value) {
    if (value === null || value === undefined || isNaN(value)) return '0.00'
    return value.toFixed(2)
}

/**
 * Format weight in tons
 * Example: 1250.5 -> "1,250.5 ton"
 */
export function formatTons(value) {
    if (value === null || value === undefined || isNaN(value)) return '0 ton'
    return `${value.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} ton`
}

/**
 * Chart color palette for consistent styling
 */
export const chartColors = {
    primary: [
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(16, 185, 129, 0.8)',   // Green
        'rgba(245, 158, 11, 0.8)',   // Amber
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(139, 92, 246, 0.8)',   // Purple
        'rgba(236, 72, 153, 0.8)',   // Pink
        'rgba(20, 184, 166, 0.8)',   // Teal
        'rgba(249, 115, 22, 0.8)',   // Orange
        'rgba(99, 102, 241, 0.8)',   // Indigo
        'rgba(34, 197, 94, 0.8)'     // Emerald
    ],
    borders: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(20, 184, 166, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(99, 102, 241, 1)',
        'rgba(34, 197, 94, 1)'
    ]
}
