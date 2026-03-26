import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

// ✅ Lấy tất cả bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email phone")
      .populate("tourId", "title price location")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy bookings của user đang đăng nhập
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("tourId", "title price location images duration")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Tạo booking mới
export const createBooking = async (req, res) => {
  try {
    const { tourId, numberOfPeople } = req.body;

    if (!tourId || !numberOfPeople) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });

    if (tour.availableSlots < numberOfPeople) {
      return res.status(400).json({ message: "Không đủ chỗ trống" });
    }

    const totalPrice = tour.price * numberOfPeople;

    const booking = await Booking.create({
      userId: req.user._id,
      tourId,
      numberOfPeople,
      totalPrice,
      status: "pending",
    });

    // Trừ slot
    tour.availableSlots -= numberOfPeople;
    await tour.save();

    await booking.populate("tourId", "title price location");
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Cập nhật trạng thái booking (admin)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email").populate("tourId", "title");

    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Hủy booking (user tự hủy)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking đã bị hủy trước đó" });
    }

    // Hoàn lại slot
    await Tour.findByIdAndUpdate(booking.tourId, {
      $inc: { availableSlots: booking.numberOfPeople },
    });

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Hủy booking thành công", booking });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};