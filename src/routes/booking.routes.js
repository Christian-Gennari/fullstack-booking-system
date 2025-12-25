/**
 * 📜 BOOKING ROUTES
 * * PURPOSE: Maps URL paths to Controller functions.
 */

import express from "express";
import * as bookingController from "../controllers/booking.controller.js";
import { authenticationMiddleware } from "../middleware/authentication.middleware.js";

const bookingsRouter = express.Router();

// GET /api/bookings - Get all bookings (All authenticated users)
bookingsRouter.get(
  "/",
  authenticationMiddleware,
  bookingController.listBookings
);

// POST /api/bookings - Create a new booking (All authenticated users)
bookingsRouter.post(
  "/",
  authenticationMiddleware,
  bookingController.createBooking
);

// PUT /api/bookings/:id - Update booking by ID (All authenticated users)
bookingsRouter.put(
  "/:id",
  authenticationMiddleware,
  bookingController.updateBooking
);

// DELETE /api/bookings/:id - Delete booking by ID (All authenticated users)
bookingsRouter.delete(
  "/:id",
  authenticationMiddleware,
  bookingController.deleteBooking
);

export default bookingsRouter;
