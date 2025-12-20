/**
 * 📚 ROOM REPOSITORY
 * * PURPOSE:
 * Handles all direct communication with the "rooms" table in the database.
 * * SCOPE:
 * - Function: getAllRooms() -> SELECT * FROM rooms
 * - Function: getRoomById(id) -> SELECT * FROM rooms WHERE id = ?
 * - NO logic, validation, or HTTP handling allowed here. Just SQL.
 * * RELATION:
 * - Imports: 'src/db/query.js'
 * - Imported by: 'src/controllers/rooms.controller.js'
 */
