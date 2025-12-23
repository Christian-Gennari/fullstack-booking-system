/**
 * 📜 BOOKING ROUTES
 * * PURPOSE: Maps URL paths to Controller functions.
 */

import express from "express";
import * as bookingController from "../controllers/booking.controller.js";

const bookingsRouter = express.Router();

// GET /api/bookings - Get all bookings
bookingsRouter.get("/", bookingController.listBookings);

// POST /api/bookings - Create a new booking
bookingsRouter.post("/", bookingController.createBooking);

// PUT /api/bookings/:id - Update booking by ID
bookingsRouter.put("/:id", bookingController.updateBooking);

// DELETE /api/bookings/:id - Delete booking by ID
bookingsRouter.delete("/:id", bookingController.deleteBooking);

export default bookingsRouter;
