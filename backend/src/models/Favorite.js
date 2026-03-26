import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoriteSchema);
