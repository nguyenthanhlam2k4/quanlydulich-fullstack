import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

// ✅ Lấy tất cả review của 1 tour
export const getReviewsByTour = async (req, res) => {
  try {
    const reviews = await Review.find({ tourId: req.params.tourId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Tạo review
export const createReview = async (req, res) => {
  try {
    const { tourId, rating, comment } = req.body;

    if (!tourId || !rating) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existed = await Review.findOne({ userId: req.user._id, tourId });
    if (existed) {
      return res.status(400).json({ message: "Bạn đã đánh giá tour này rồi" });
    }

    const review = await Review.create({
      userId: req.user._id,
      tourId,
      rating,
      comment,
    });

    // Cập nhật rating trung bình cho tour
    const reviews = await Review.find({ tourId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Tour.findByIdAndUpdate(tourId, { rating: avgRating.toFixed(1) });

    await review.populate("userId", "name avatar");
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Xóa review (user xóa của mình hoặc admin)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy review" });

    const isOwner = review.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Không có quyền xóa review này" });
    }

    await review.deleteOne();

    // Cập nhật lại rating tour
    const reviews = await Review.find({ tourId: review.tourId });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Tour.findByIdAndUpdate(review.tourId, { rating: avgRating.toFixed(1) });

    res.json({ message: "Xóa review thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy tất cả reviews (public - dùng cho trang home)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name avatar")
      .populate("tourId", "title")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};