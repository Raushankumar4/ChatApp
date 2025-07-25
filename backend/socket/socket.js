import { Message } from "../models/message.model.js";

const usersInRooms = new Map();

export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("connected:", socket.id);
    io.emit("connected", socket.id);
    // Join Room and get all onlinseusers of rooms
    socket.on("joinRoom", ({ username, room }) => {
      socket.join(room);
      socket.username = username;
      socket.room = room;

      // Add user to the room
      if (!usersInRooms.has(room)) {
        usersInRooms.set(room, new Set());
      }
      usersInRooms.get(room).add(username);

      // Emit updated list of online users in the room
      io.to(room).emit("onlinUsers", Array.from(usersInRooms.get(room)));
      socket.to(room).emit("userJoined", `${username} joined the room`);
    });

    //Room Chatting
    socket.on(
      "chatMessage",
      async ({ roomName, senderId, message, username }) => {
        try {
          console.log(roomName, senderId, message);

          const newMessage = await Message.create({
            message,
            senderId,
            roomName,
          });
          io.to(roomName).emit("chatMessage", newMessage);
        } catch (err) {
          console.error("Room message error:", err.message);
          socket.emit("errorMessage", "Failed to send message");
        }
      }
    );

    // typing
    socket.on("typing", ({ room, username }) => {
      socket.to(room).emit("showTyping", `${username} is typing...`);
    });

    // Private Chating
    socket.on("privateMessage", async ({ senderId, receiverId, message }) => {
      try {
        const newMessage = await Message.create({
          message,
          senderId,
          receiverId,
        });

        io.to(senderId).to(receiverId).emit("privateMessage", newMessage);
      } catch (err) {
        console.error("Private message error:", err.message);
        socket.emit("errorMessage", "Failed to send private message");
      }
    });

    socket.on("disconnect", () => {
      const room = socket.room;
      const username = socket.username;

      if (room && usersInRooms.has(room)) {
        usersInRooms.get(room).delete(username);

        // Clean up empty room
        if (usersInRooms.get(room).size === 0) {
          usersInRooms.delete(room);
        } else {
          // Emit updated list after user left
          io.to(room).emit("onlinUsers", Array.from(usersInRooms.get(room)));

          // Notify others user has left
          socket.to(room).emit("userLeft", `${username} left the room`);
        }

        console.log(`${username} disconnected from room: ${room}`);
        console.log("Updated Room Map:", usersInRooms);
      }
    });
  });
};
