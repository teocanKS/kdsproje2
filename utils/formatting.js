/**
 * Shared formatting utilities for the KDS dashboard
 */

// Maximum money value in TL (999M)
const MAX_MONEY_TL = 999_000_000

/**
 * Clamp money value to max 999M TL
 */
export function clampMoney(value) {
    if (value === null || value === undefined || isNaN(value)) return 0
    return Math.min(Math.max(0, value), MAX_MONEY_TL)
}

/**
 * Format a number in millions with TRY symbol
 * Capped at 999M TL maximum
 * Example: 12500000 -> "₺12.5M"
 */
export function formatMillionsTRY(valueTL) {
    if (valueTL === null || valueTL === undefined || isNaN(valueTL)) return '₺0M'

    // Clamp to max 999M
    const clamped = clampMoney(valueTL)
    const millions = clamped / 1_000_000

    return `₺${millions.toFixed(1)}M`
}

/**
 * Legacy alias for formatMillionsTRY
 * @deprecated Use formatMillionsTRY instead
 */
export function formatMillions(value) {
    return formatMillionsTRY(value)
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
 * Convert ratio to 0-1 scale
 * Handles both 0-1 and 0-100 formats
 * @param {number} x - Value that might be 0-1 or 0-100
 * @returns {number} Value normalized to 0-1
 */
export function toRatio01(x) {
    if (x === null || x === undefined || isNaN(x)) return 0
    // If value is > 1.5, assume it's in 0-100 format
    if (x > 1.5) return x / 100
    return x
}

/**
 * Convert ratio to percentage (0-100)
 * @param {number} x - Value that might be 0-1 or 0-100  
 * @returns {number} Value as percentage 0-100
 */
export function toPercent(x) {
    if (x === null || x === undefined || isNaN(x)) return 0
    // If value is <= 1.5, assume it's in 0-1 format
    if (x <= 1.5) return x * 100
    return x
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
