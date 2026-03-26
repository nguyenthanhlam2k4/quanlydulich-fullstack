import express from "express";
import multer from "multer";
import { getAllTours, getTourById, createTour, updateTour, deleteTour } from "../controllers/tourController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/tours         → public
router.get("/", getAllTours);

// GET /api/tours/:id     → public
router.get("/:id", getTourById);

// POST /api/tours        → admin
router.post("/", verifyToken, verifyAdmin, upload.array("images", 10), createTour);

// PUT /api/tours/:id     → admin
router.put("/:id", verifyToken, verifyAdmin, upload.array("images", 10), updateTour);

// DELETE /api/tours/:id  → admin
router.delete("/:id", verifyToken, verifyAdmin, deleteTour);

export default router;