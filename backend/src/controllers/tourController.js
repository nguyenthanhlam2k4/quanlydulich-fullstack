import Tour from "../models/Tour.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Lấy tất cả tours
export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy 1 tour theo ID
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate("createdBy", "name email");
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Tạo tour mới (admin)
export const createTour = async (req, res) => {
  try {
    const { title, description, price, location, duration, maxPeople, availableSlots, schedule } = req.body;

    if (!title || !price || !location) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    // Upload nhiều ảnh lên Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "tours" }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              })
              .end(file.buffer);
          })
      );
      imageUrls = await Promise.all(uploadPromises);
    }

    const newTour = await Tour.create({
      title,
      description,
      price,
      location,
      duration,
      maxPeople,
      availableSlots,
      images: imageUrls,
      schedule: schedule ? JSON.parse(schedule) : [],
      createdBy: req.user._id,
    });

    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Cập nhật tour (admin)
export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });

    const { title, description, price, location, duration, maxPeople, availableSlots, schedule } = req.body;

    // Upload ảnh mới nếu có
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "tours" }, (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              })
              .end(file.buffer);
          })
      );
      tour.images = await Promise.all(uploadPromises);
    }

    if (title) tour.title = title;
    if (description) tour.description = description;
    if (price) tour.price = price;
    if (location) tour.location = location;
    if (duration) tour.duration = duration;
    if (maxPeople) tour.maxPeople = maxPeople;
    if (availableSlots) tour.availableSlots = availableSlots;
    if (schedule) tour.schedule = JSON.parse(schedule);

    await tour.save();
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Xóa tour (admin)
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });
    res.json({ message: "Xóa tour thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};