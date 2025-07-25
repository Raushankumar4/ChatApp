import { useEffect } from "react";
import { useState } from "react";
import socket from "../socket/socket";

const TypingIndicator = ({ room, username }) => {
  const [typing, setTyping] = useState("");

  useEffect(() => {
    socket.on("showTyping", (message) => {
      setTyping(message);

      const timer = setTimeout(() => setTyping(""), 2000);
      return () => clearTimeout(timer);
    });

    return () => {
      socket.off("showTyping");
    };
  }, []);

  return typing ? <div style={{ color: "black" }} className="typing-indicator">{typing}</div> : null;
};

export default TypingIndicator;
