import Tour from "../models/Tour.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Lấy tất cả tours (có filter + phân trang)
export const getAllTours = async (req, res) => {
  try {
    const { keyword, location, priceRange, page = 1, limit = 6 } = req.query;

    const filter = {};

    // Tìm theo tên
    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }

    // Lọc theo tỉnh thành (locations là array)
    if (location) {
      filter.locations = { $in: [new RegExp(location, "i")] };
    }

    // Lọc theo giá
    if (priceRange === "under2m") filter.price = { $lt: 2000000 };
    else if (priceRange === "2m-5m") filter.price = { $gte: 2000000, $lte: 5000000 };
    else if (priceRange === "over5m") filter.price = { $gt: 5000000 };

    const total = await Tour.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const tours = await Tour.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ tours, total, totalPages, currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy tất cả locations có trong DB (cho dropdown filter)
export const getLocations = async (req, res) => {
  try {
    const tours = await Tour.find({}, "locations");
    const allLocations = tours.flatMap(t => t.locations || []);
    const unique = [...new Set(allLocations)].sort();
    res.json(unique);
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

// ✅ Tạo tour mới
export const createTour = async (req, res) => {
  try {
    const { title, description, price, locations, duration, maxPeople, availableSlots, schedule } = req.body;

    if (!title || !price || !locations) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    let imageUrls = [];
    if (req.files?.length > 0) {
      const uploads = req.files.map(file =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "tours" }, (err, result) => {
            if (err) reject(err); else resolve(result.secure_url);
          }).end(file.buffer);
        })
      );
      imageUrls = await Promise.all(uploads);
    }

    // locations từ body có thể là string "A,B,C" hoặc JSON array
    let parsedLocations = locations;
    if (typeof locations === "string") {
      try { parsedLocations = JSON.parse(locations); }
      catch { parsedLocations = locations.split(",").map(l => l.trim()).filter(Boolean); }
    }

    const newTour = await Tour.create({
      title, description, price, locations: parsedLocations,
      duration, maxPeople, availableSlots,
      images: imageUrls,
      schedule: schedule ? JSON.parse(schedule) : [],
      createdBy: req.user._id,
    });

    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Cập nhật tour
export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });

    const { title, description, price, locations, duration, maxPeople, availableSlots, schedule } = req.body;

    if (req.files?.length > 0) {
      const uploads = req.files.map(file =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "tours" }, (err, result) => {
            if (err) reject(err); else resolve(result.secure_url);
          }).end(file.buffer);
        })
      );
      tour.images = await Promise.all(uploads);
    }

    if (title) tour.title = title;
    if (description) tour.description = description;
    if (price) tour.price = price;
    if (duration) tour.duration = duration;
    if (maxPeople) tour.maxPeople = maxPeople;
    if (availableSlots) tour.availableSlots = availableSlots;
    if (schedule) tour.schedule = JSON.parse(schedule);

    if (locations) {
      let parsedLocations = locations;
      if (typeof locations === "string") {
        try { parsedLocations = JSON.parse(locations); }
        catch { parsedLocations = locations.split(",").map(l => l.trim()).filter(Boolean); }
      }
      tour.locations = parsedLocations;
    }

    await tour.save();
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Xóa tour
export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });
    res.json({ message: "Xóa tour thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};