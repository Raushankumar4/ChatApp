import { Message } from "../models/message.model.js";
import { Room } from "../models/room.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { response } from "../utils/responseHandler.js";

export const createRoom = asyncHandler(async (req, res) => {
  const { roomName } = req.body;
  const userId = req.user.id;
  if (!roomName) {
    return response.error(res, "RoomName is required", 400);
  }
  const existingRoom = await Room.findOne({ roomName });
  if (existingRoom) {
    return response.error(res, "Room already exists", 400);
  }
  const newRoom = await Room.create({ roomName, userId });
  return response.success(res, "Room Created", newRoom, 201);
});

export const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find()
    .sort({ createdAt: -1 })
    .populate("userId", "username");
  return response.success(res, "Rooms", rooms, 200);
});

export const sendPrivateMessage = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id;

  if (!receiverId || !message) {
    return res
      .status(400)
      .json({ message: "Receiver and message are required." });
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: "Receiver not found." });
  }

  const newMessage = await Message.create({
    message,
    senderId,
    receiverId,
    roomId: null,
  });

  res.status(201).json(newMessage);
});

export const getPrivateMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "username")
      .populate("receiverId", "username");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching private messages" });
  }
};

export const getRoomMessages = async (req, res) => {
  const { roomName } = req.params;

  try {
    const messages = await Message.find({ roomName })
      .sort({ createdAt: 1 })
      .populate("senderId", "username");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching room messages" });
  }
};
