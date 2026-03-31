import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    numberOfPeople: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    bookingDate: { type: Date, default: Date.now },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    paymentMethod: { type: String, default: "vnpay" },
    vnpayTxnRef: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);