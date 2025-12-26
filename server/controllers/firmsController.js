import { queryFirms } from '../db/supabase.js'

/**
 * Controller: Get all firms for dropdown selection
 * Returns: Array of { id, ad }
 */
export async function getAllFirms() {
    const firms = await queryFirms()
    return firms
}
