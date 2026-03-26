import express from "express";
import multer from "multer";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer dùng memory storage (upload thẳng lên Cloudinary)
const upload = multer({ storage: multer.memoryStorage() });

// GET /api/users         → lấy tất cả (admin)
router.get("/", verifyToken, verifyAdmin, getAllUsers);
// router.get("/", getAllUsers);

// GET /api/users/:id     → lấy 1 user
router.get("/:id", verifyToken, getUserById);
// router.get("/:id", getUserById);

// POST /api/users        → tạo mới (admin)
router.post("/", verifyToken, verifyAdmin, upload.single("avatar"), createUser);
// router.post("/", upload.single("avatar"), createUser);

// PUT /api/users/:id     → cập nhật (admin)
// router.put("/:id", verifyToken, verifyAdmin, upload.single("avatar"), updateUser);
router.put("/:id", verifyToken, upload.single("avatar"), updateUser);

// router.put("/:id", upload.single("avatar"), updateUser);

// DELETE /api/users/:id  → xóa (admin)
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);
// router.delete("/:id", deleteUser);

export default router;