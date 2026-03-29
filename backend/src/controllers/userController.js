import bcrypt from "bcryptjs";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Lấy tất cả users
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, sort, deleted } = req.query;
    const filter = {};
    filter.isDeleted = deleted === "true";
    if (role && role !== "all") filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
    const users = await User.find(filter).select("-password").sort(sortOption);
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

// ✅ Tạo user mới
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(password, 10);
    let avatarUrl = "";
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(req.file.buffer);
      });
      avatarUrl = result.secure_url;
    }

    const newUser = await User.create({
      name, email, password: hashed, phone, role: role || "user", avatar: avatarUrl,
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
    const currentUser = req.user;
    const targetId = req.params.id;

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const isAdmin = currentUser.role === "admin";
    const isSelf = currentUser._id.toString() === targetId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Không có quyền chỉnh sửa user này" });
    }

    // ✅ Admin không thể tự hạ role của mình xuống user
    if (isSelf && isAdmin && role === "user") {
      return res.status(400).json({ message: "Không thể tự hạ role của chính mình" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role && isAdmin) user.role = role;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (error, result) => { if (error) reject(error); else resolve(result); }
        ).end(req.file.buffer);
      });
      user.avatar = result.secure_url;
    }

    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Xóa mềm
export const softDeleteUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetId = req.params.id;

    // ✅ Admin không thể tự xóa mình
    if (currentUser._id.toString() === targetId) {
      return res.status(400).json({ message: "Không thể tự xóa tài khoản của chính mình" });
    }

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.json({ message: "Đã chuyển vào thùng rác" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Khôi phục user
export const restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    user.isDeleted = false;
    user.deletedAt = null;
    await user.save();
    res.json({ message: "Khôi phục thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Xóa vĩnh viễn
export const deleteUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetId = req.params.id;

    // ✅ Admin không thể tự xóa vĩnh viễn mình
    if (currentUser._id.toString() === targetId) {
      return res.status(400).json({ message: "Không thể tự xóa tài khoản của chính mình" });
    }

    const user = await User.findByIdAndDelete(targetId);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Xóa vĩnh viễn thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Đổi mật khẩu
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Chỉ cho phép đổi mật khẩu của chính mình
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Không có quyền thực hiện" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};