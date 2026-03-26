import bcrypt from "bcryptjs";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Lấy tất cả users (admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy 1 user theo ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Tạo user mới (admin)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);

    // Upload avatar nếu có file
    let avatarUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      avatarUrl = result.secure_url;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      phone,
      role: role || "user",
      avatar: avatarUrl,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Cập nhật user
export const updateUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const currentUser = req.user;
    const isAdmin = currentUser.role === "admin";

    // User bình thường chỉ sửa chính mình
    if (!isAdmin && currentUser._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa user này" });
    }

    // Chỉ admin mới được sửa role
    if (role && isAdmin) user.role = role;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Upload avatar nếu có file
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      user.avatar = result.secure_url; // ✅ Lưu vào DB
    }

    await user.save(); // ✅ Cập nhật DB

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Xóa user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};