import express from "express";
import { getReviewsByTour, createReview, deleteReview, getAllReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/reviews/all       → public, lấy tất cả reviews
router.get("/all", getAllReviews);

// GET /api/reviews/tour/:tourId  → public
router.get("/tour/:tourId", getReviewsByTour);

// POST /api/reviews              → user đã đăng nhập
router.post("/", verifyToken, createReview);

// DELETE /api/reviews/:id        → user hoặc admin
router.delete("/:id", verifyToken, deleteReview);

export default router;