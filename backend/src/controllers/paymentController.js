import crypto from "crypto";
import moment from "moment";
import Booking from "../models/Booking.js";

const VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNP_TMN_CODE = process.env.VNP_TMN_CODE;
const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET;
const VNP_RETURN_URL = process.env.VNP_RETURN_URL;

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// ✅ Tạo URL thanh toán VNPay
export const createPaymentUrl = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("tourId", "title");
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking" });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền thanh toán booking này" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking đã bị hủy" });
    }

    const createDate = moment().format("YYYYMMDDHHmmss");
    const orderId = `${moment().format("HHmmss")}_${bookingId}`;
    const amount = booking.totalPrice * 100;

    const ipAddr = req.headers["x-forwarded-for"]
      || req.connection?.remoteAddress
      || req.socket?.remoteAddress
      || "127.0.0.1";

    let vnpParams = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: VNP_TMN_CODE,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan booking ${bookingId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount,
      vnp_ReturnUrl: VNP_RETURN_URL,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnpParams = sortObject(vnpParams);

    // Tạo chuỗi ký
    const signData = Object.entries(vnpParams)
      .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnpParams["vnp_SecureHash"] = signed;

    const queryString = Object.entries(vnpParams)
      .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
      .join("&");

    const paymentUrl = `${VNP_URL}?${queryString}`;
    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ VNPay callback
export const vnpayReturn = async (req, res) => {
  try {
    const vnpParams = { ...req.query };
    const secureHash = vnpParams["vnp_SecureHash"];

    delete vnpParams["vnp_SecureHash"];
    delete vnpParams["vnp_SecureHashType"];

    const sortedParams = sortObject(vnpParams);

    const signData = Object.entries(sortedParams)
      .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return res.redirect(`http://localhost:5173/payment/result?status=failed&message=Chu+ky+khong+hop+le`);
    }

    const responseCode = vnpParams["vnp_ResponseCode"];
    const txnRef = vnpParams["vnp_TxnRef"]; // format: HHmmss_bookingId
    const bookingId = txnRef.split("_")[1];

    if (responseCode === "00") {
      await Booking.findByIdAndUpdate(bookingId, {
        status: "confirmed",
        isPaid: true,
        paidAt: new Date(),
        vnpayTxnRef: vnpParams["vnp_TransactionNo"],
      });
      return res.redirect(`http://localhost:5173/payment/result?status=success&bookingId=${bookingId}`);
    } else {
      return res.redirect(`http://localhost:5173/payment/result?status=failed&message=Thanh+toan+that+bai`);
    }
  } catch (error) {
    res.redirect(`http://localhost:5173/payment/result?status=failed&message=Loi+server`);
  }
};