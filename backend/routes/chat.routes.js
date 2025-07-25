import { Router } from "express";
import {
  createRoom,
  getAllRooms,
  getPrivateMessages,
  getRoomMessages,
  sendPrivateMessage,
} from "../controllers/chat.controller.js";
import { isAuthenticatedUser } from "../middleware/isAuthenticated.js";

const router = Router();

router.route("/create-room").post(isAuthenticatedUser, createRoom);
router.route("/rooms").get(isAuthenticatedUser, getAllRooms);
router.route("/send-msg").post(isAuthenticatedUser, sendPrivateMessage);
router.route("/messages").get(isAuthenticatedUser, getPrivateMessages);
router
  .route("/messages/room/:roomName")
  .get(isAuthenticatedUser, getRoomMessages);

export default router;
