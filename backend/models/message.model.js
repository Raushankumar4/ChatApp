import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    roomName: { type: String, default: null },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
