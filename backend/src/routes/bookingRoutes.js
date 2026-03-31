import express from "express";
import {
  getAllBookings, getMyBookings, createBooking,
  updateBookingStatus, cancelBooking, softDeleteBooking,
} from "../controllers/bookingController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getAllBookings);
router.get("/my", verifyToken, getMyBookings);
router.post("/", verifyToken, createBooking);
router.put("/:id/status", verifyToken, verifyAdmin, updateBookingStatus);
router.put("/:id/cancel", verifyToken, cancelBooking);
router.delete("/:id", verifyToken, verifyAdmin, softDeleteBooking);

export default router;