import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
