import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token, từ chối truy cập" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "User không tồn tại" });

    // ✅ Chặn user đã bị xóa mềm
    if (user.isDeleted) {
      return res.status(403).json({ message: "Tài khoản đã bị khóa, vui lòng liên hệ admin" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới có quyền thực hiện" });
  }
  next();
};