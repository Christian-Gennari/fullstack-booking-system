/**
 * 🤵 ROOM CONTROLLER
 * * PURPOSE:
 * Handles incoming HTTP requests for Room data.
 * * SCOPE:
 * - listRooms(req, res):
 * 1. Call roomRepo.getAllRooms()
 * 2. Send response: res.json(data)
 * * RELATION:
 * - Imports: 'src/repositories/room.repo.js'
 * - Imported by: 'src/routes/rooms.routes.js'
 */
