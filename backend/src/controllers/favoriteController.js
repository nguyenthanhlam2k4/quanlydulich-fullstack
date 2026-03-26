import Favorite from "../models/Favorite.js";

// ✅ Lấy danh sách yêu thích của user
export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate("tourId", "title price location images rating duration")
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Thêm / bỏ yêu thích (toggle)
export const toggleFavorite = async (req, res) => {
  try {
    const { tourId } = req.body;
    if (!tourId) return res.status(400).json({ message: "Thiếu tourId" });

    const existed = await Favorite.findOne({ userId: req.user._id, tourId });

    if (existed) {
      await existed.deleteOne();
      return res.json({ message: "Đã bỏ yêu thích", isFavorite: false });
    }

    await Favorite.create({ userId: req.user._id, tourId });
    res.status(201).json({ message: "Đã thêm yêu thích", isFavorite: true });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};