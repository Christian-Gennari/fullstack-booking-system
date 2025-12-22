/**
 * ⚙️ APP CONFIGURATION
 * PURPOSE: The main "Rulebook" for the Express application.
 */
import express from "express";
import bookingsRouter from "./routes/bookings.routes.js";
import roomsRouter from "./routes/rooms.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(express.static("src/public"));

// Define routes
app.use("/api/auth", authRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
