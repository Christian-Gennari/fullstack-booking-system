/**
 * 🤵 BOOKING CONTROLLER
 * * PURPOSE: Handles requests to create or view bookings.
 */

import * as bookingRepo from "./booking.repo.js";
import { CreateBookingDTO, UpdateBookingDTO } from "./booking.dto.js";

/**
 * GET /api/bookings
 * - Students: only their own bookings
 * - Teachers/Admins: all bookings, or can filter with ?userId=
 */
export const listBookings = (req, res) => {
  try {
    const authUser = req.user;
    if (!authUser) return res.sendStatus(401);

    // If student -> only their bookings
    if (authUser.role === "student") {
      const bookings = bookingRepo.getAllBookingsByUserWithRoom(authUser.id);
      return res.status(200).json(bookings);
    }

    // Teachers/Admins can optionally filter by query param
    if (req.query.userId) {
      const userId = Number(req.query.userId);
      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ error: "Invalid userId" });
      }
      const bookings = bookingRepo.getAllBookingsByUserWithRoom(userId);
      return res.status(200).json(bookings);
    }

    // Default: return all bookings (for teachers/admins)
    const bookings = bookingRepo.getAllBookingsWithRoom();
    return res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return res.sendStatus(500);
  }
};

/**
 * POST /api/bookings
 */
export const createBooking = (req, res) => {
  try {
    // 1. Validation & Data Prep (Handled by DTO)
    // This will throw an error immediately if data is missing or wrong type
    const bookingDTO = new CreateBookingDTO(req.body);

    // 2. Check for Overlaps (Prevent Double Booking)
    const overlaps = bookingRepo.getOverlappingBookings(
      bookingDTO.room_id,
      bookingDTO.start_time,
      bookingDTO.end_time
    );

    if (overlaps.length > 0) {
      return res.status(409).json({
        error: "This room is already booked for the selected time slot.",
      });
    }

    // 3. Pass clean data to Repo
    // .toStorage() ensures we only send the fields defined in our DTO
    bookingRepo.createBooking(bookingDTO.toStorage());

    return res.status(201).send();
  } catch (error) {
    // Handle DTO validation errors
    if (
      error.message.includes("Missing") ||
      error.message.includes("must be")
    ) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error creating booking:", error);
    return res.sendStatus(500);
  }
};

/**
 * PUT /api/bookings/:id
 * Updates a booking using a "Fetch -> Merge -> Update" strategy.
 */
export const updateBooking = (req, res) => {
  try {
    const id = Number(req.params.id);

    // 1. Validate Incoming Data (Handled by DTO)
    // If req.body is empty or invalid, this will throw.
    const updateDTO = new UpdateBookingDTO(req.body);

    // 2. Fetch Existing Booking
    const existingBooking = bookingRepo.getBookingById(id);

    if (!existingBooking) {
      return res.status(404).json({ error: `Booking with ID ${id} not found` });
    }

    // 3. Prepare Data (Merge Strategy)
    // We merge the CLEANED partial update into the existing data
    const bookingData = {
      ...existingBooking, // Start with old data
      ...updateDTO.toPartialUpdate(), // Overwrite with valid new data
    };

    // 4. Perform Update
    const info = bookingRepo.updateBookingById(id, bookingData);

    if (info.changes === 0) {
      return res.status(404).json({ error: `Could not update booking ${id}` });
    }

    res.status(200).json({
      message: `Updated booking with ID ${id}`,
      booking: bookingData,
    });
  } catch (error) {
    if (error.message === "No valid fields provided for update") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
};

/**
 * DELETE /api/bookings/:id
 */
export const deleteBooking = (req, res) => {
  try {
    const id = Number(req.params.id);
    const info = bookingRepo.deleteBookingById(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: `Booking with ID ${id} not found` });
    }

    res.status(200).send(`Deleted booking with ID ${id}`);
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.sendStatus(500);
  }
};

/**
 * GET /api/bookings/user/:userId
 */
export const listBookingsByUser = (req, res) => {
  try {
    const authUser = req.user;
    if (!authUser) return res.sendStatus(401);

    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: "Missing or invalid userId" });
    }

    // Prevent students from viewing others' bookings
    if (authUser.role === "student" && authUser.id !== userId) {
      return res.status(403).json({ error: "Access denied." });
    }

    const bookings = bookingRepo.getAllBookingsByUserWithRoom(userId);
    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings by user:", error);
    return res.sendStatus(500);
  }
};
