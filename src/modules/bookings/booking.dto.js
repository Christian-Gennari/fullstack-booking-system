/**
 * 🛡️ BOOKING DTO
 * Defines the shape of data for creating and updating bookings.
 */

export class CreateBookingDTO {
  constructor(data) {
    this.room_id = data.room_id;
    this.user_id = data.user_id;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.status = data.status || "active"; // Default to 'active'
    this.notes = data.notes || null; // Default to null

    this.validate();
  }

  validate() {
    // 1. Required fields
    if (!this.room_id) throw new Error("Missing required field: room_id");
    if (!this.user_id) throw new Error("Missing required field: user_id");
    if (!this.start_time) throw new Error("Missing required field: start_time");
    if (!this.end_time) throw new Error("Missing required field: end_time");

    // 2. Type correctness
    this.room_id = Number(this.room_id);
    this.user_id = Number(this.user_id);

    if (isNaN(this.room_id))
      throw new Error("Field 'room_id' must be a number");
    if (isNaN(this.user_id))
      throw new Error("Field 'user_id' must be a number");

    // 3. Simple logical check to ensure start_time is before end_time
    if (new Date(this.start_time) >= new Date(this.end_time)) {
      throw new Error("start_time must be before end_time");
    }
  }

  // Returns a clean object ready for the Repository
  toStorage() {
    return {
      room_id: this.room_id,
      user_id: this.user_id,
      start_time: this.start_time,
      end_time: this.end_time,
      status: this.status,
      notes: this.notes,
    };
  }
}

export class UpdateBookingDTO {
  constructor(data) {
    // We explicitly list what is ALLOWED to be updated.
    this.room_id = data.room_id;
    this.user_id = data.user_id;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.status = data.status;
    this.notes = data.notes;
  }

  // Returns only the fields present in the request (undefined fields are ignored)
  toPartialUpdate() {
    const fields = {};

    if (this.room_id !== undefined) fields.room_id = Number(this.room_id);
    if (this.user_id !== undefined) fields.user_id = Number(this.user_id);
    if (this.start_time !== undefined) fields.start_time = this.start_time;
    if (this.end_time !== undefined) fields.end_time = this.end_time;
    if (this.status !== undefined) fields.status = this.status;
    if (this.notes !== undefined) fields.notes = this.notes;

    if (Object.keys(fields).length === 0) {
      throw new Error("No valid fields provided for update");
    }
    return fields;
  }
}
