import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    duration: { type: String, default: "" },
    images: [{ type: String }],
    maxPeople: { type: Number, default: 0 },
    availableSlots: { type: Number, default: 0 },
    schedule: [
      {
        day: { type: Number },
        content: { type: String },
      },
    ],
    rating: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
