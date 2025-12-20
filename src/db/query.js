/**
 * 🛠️ DATABASE HELPERS
 * * PURPOSE:
 * A wrapper to make running SQL commands easier and cleaner.
 * * SCOPE:
 * - Export function 'all(sql, params)' -> Returns an Array of rows (for lists).
 * - Export function 'get(sql, params)' -> Returns a Single row (for IDs).
 * - Export function 'run(sql, params)' -> Returns nothing (for INSERT/UPDATE/DELETE).
 * * RELATION:
 * - Imports: 'src/db/db.js'
 * - Imported by: All files in 'src/repositories/'
 */
