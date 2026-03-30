import express from "express";
import { createPaymentUrl, vnpayReturn } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/payment/create  → tạo URL thanh toán
router.post("/create", verifyToken, createPaymentUrl);

// GET /api/payment/vnpay-return  → VNPay callback (không cần token)
router.get("/vnpay-return", vnpayReturn);

export default router;