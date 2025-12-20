/**
 * 🔌 DATABASE CONNECTION
 * * PURPOSE:
 * This file creates the permanent connection to our SQLite database file.
 * * SCOPE:
 * - Initialize the connection to 'identifier.sqlite'.
 * - Enable Foreign Key enforcement (PRAGMA foreign_keys = ON).
 * - Handle connection errors (log error and exit).
 * * RELATION:
 * - Imported by: 'src/db/query.js'
 */
