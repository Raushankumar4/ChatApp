import { useState } from "react";
import socket from "../socket/socket";
import { useQueryClient } from "@tanstack/react-query";

const MessageInput = ({ room, username }) => {
  const [input, setInput] = useState("");
  const querClient = useQueryClient()

  const sendMessage = () => {
    if (!input.trim()) return;
    setInput("");
    socket.emit("chatMessage", { roomName: room, senderId: username?._id, message: input, username: username?.username })
    querClient.invalidateQueries("roomMessages")
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatroom-input-area">
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          socket.emit("typing", {
            room,
            username: username?.username,
          })
        }}
        onKeyDown={handleKeyPress}
      />
      <button className="button" onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
