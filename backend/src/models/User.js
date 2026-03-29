import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    avatar: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false }, 
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);