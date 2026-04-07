import express from "express";
import multer from "multer";
import { getAllTours, getTourById, createTour, updateTour, deleteTour, getLocations } from "../controllers/tourController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllTours);
router.get("/locations", getLocations);       // ✅ lấy danh sách tỉnh thành
router.get("/:id", getTourById);
router.post("/", verifyToken, verifyAdmin, upload.array("images", 10), createTour);
router.put("/:id", verifyToken, verifyAdmin, upload.array("images", 10), updateTour);
router.delete("/:id", verifyToken, verifyAdmin, deleteTour);

export default router;