/**
 * 🤵 BOOKING CONTROLLER
 * * PURPOSE:
 * Handles requests to create or view bookings.
 * * SCOPE:
 * - createBooking(req, res):
 * 1. Extract { roomId, userId, start, end } from req.body.
 * 2. (Optional) Check availability rules here.
 * 3. Call bookingRepo.createBooking().
 * 4. Return 201 Created.
 * * RELATION:
 * - Imports: 'src/repositories/booking.repo.js'
 * - Imported by: 'src/routes/bookings.routes.js'
 */
