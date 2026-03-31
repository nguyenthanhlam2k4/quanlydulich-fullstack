import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

// ── Gửi email xác nhận kèm QR ───────────────────────
const sendConfirmEmail = async (booking) => {
  try {
    const user = await User.findById(booking.userId);
    const tour = await Tour.findById(booking.tourId);
    if (!user || !tour) return;

    // Tạo QR data
    const qrData = JSON.stringify({
      bookingId: booking._id,
      tour: tour.title,
      location: tour.location,
      people: booking.numberOfPeople,
      total: booking.totalPrice,
      status: "confirmed",
    });

    // Tạo QR image base64
    const qrBase64 = await QRCode.toDataURL(qrData);
    const qrBuffer = Buffer.from(qrBase64.split(",")[1], "base64");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TrIP Tours" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: `✅ Xác nhận đặt tour: ${tour.title}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#2563eb;">🎉 Booking đã được xác nhận!</h2>
          <p>Xin chào <b>${user.name}</b>,</p>
          <p>Booking của bạn đã được admin xác nhận. Vui lòng mang mã QR bên dưới khi đi tour.</p>

          <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:16px 0;">
            <p><b>Tour:</b> ${tour.title}</p>
            <p><b>Địa điểm:</b> ${tour.location}</p>
            <p><b>Thời gian:</b> ${tour.duration}</p>
            <p><b>Số người:</b> ${booking.numberOfPeople}</p>
            <p><b>Tổng tiền:</b> ${booking.totalPrice.toLocaleString("vi-VN")}đ</p>
            <p><b>Mã booking:</b> ${booking._id}</p>
          </div>

          <div style="text-align:center;margin:24px 0;">
            <p style="color:#6b7280;font-size:14px;">Mã QR xác nhận tour</p>
            <img src="cid:qrcode" alt="QR Code" style="width:200px;height:200px;" />
          </div>

          <p style="color:#6b7280;font-size:13px;">Cảm ơn bạn đã tin tưởng TrIP Tours. Chúc bạn có chuyến đi tuyệt vời! 🌟</p>
        </div>
      `,
      attachments: [{
        filename: "qrcode.png",
        content: qrBuffer,
        cid: "qrcode",
      }],
    });
  } catch (err) {
    console.error("Lỗi gửi email:", err.message);
  }
};

// ✅ Lấy tất cả bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ isDeleted: { $ne: true } })
      .populate("userId", "name email phone avatar")
      .populate("tourId", "title price location images duration")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Lấy bookings của user đang đăng nhập
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id, isDeleted: { $ne: true } })
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

    tour.availableSlots -= numberOfPeople;
    await tour.save();

    await booking.populate("tourId", "title price location");
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ Cập nhật trạng thái booking (admin)
// Chỉ cho xác nhận khi đã thanh toán (isPaid = true)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    // ✅ Chỉ cho xác nhận khi đã thanh toán
    if (status === "confirmed" && !booking.isPaid) {
      return res.status(400).json({ message: "Khách hàng chưa thanh toán" });
    }

    booking.status = status;
    await booking.save();

    await booking.populate("userId", "name email");
    await booking.populate("tourId", "title location duration");

    // ✅ Gửi email khi xác nhận
    if (status === "confirmed") {
      sendConfirmEmail(booking);
    }

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

// ✅ Xóa mềm booking đã hủy (admin)
export const softDeleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    if (booking.status !== "cancelled") {
      return res.status(400).json({ message: "Chỉ có thể xóa booking đã hủy" });
    }

    booking.isDeleted = true;
    booking.deletedAt = new Date();
    await booking.save();

    res.json({ message: "Đã xóa booking" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};