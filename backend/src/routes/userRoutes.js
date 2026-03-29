import express from "express";
import multer from "multer";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  softDeleteUser,
  restoreUser,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.post("/", verifyToken, verifyAdmin, upload.single("avatar"), createUser);
router.put("/:id", verifyToken, upload.single("avatar"), updateUser);
router.put("/:id/password", verifyToken, changePassword);
router.patch("/:id/soft-delete", verifyToken, verifyAdmin, softDeleteUser);
router.patch("/:id/restore", verifyToken, verifyAdmin, restoreUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;