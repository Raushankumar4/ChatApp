export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
