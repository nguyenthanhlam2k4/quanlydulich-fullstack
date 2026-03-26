import express from "express";
import { getMyFavorites, toggleFavorite } from "../controllers/favoriteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/favorites     → user xem danh sách yêu thích
router.get("/", verifyToken, getMyFavorites);

// POST /api/favorites    → toggle thêm/bỏ yêu thích
router.post("/", verifyToken, toggleFavorite);

export default router;