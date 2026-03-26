import express from "express";
import { getAllBookings, getMyBookings, createBooking, updateBookingStatus, cancelBooking } from "../controllers/bookingController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/bookings          → admin
router.get("/", verifyToken, verifyAdmin, getAllBookings);

// GET /api/bookings/my       → user xem booking của mình
router.get("/my", verifyToken, getMyBookings);

// POST /api/bookings         → user đặt tour
router.post("/", verifyToken, createBooking);

// PUT /api/bookings/:id/status → admin cập nhật trạng thái
router.put("/:id/status", verifyToken, verifyAdmin, updateBookingStatus);

// PUT /api/bookings/:id/cancel → user hủy booking
router.put("/:id/cancel", verifyToken, cancelBooking);

export default router;