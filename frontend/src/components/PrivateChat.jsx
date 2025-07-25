import { useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser, getPrivateMessages } from "./services/api";
import { useState, useEffect, useRef } from "react";
import socket from "../socket/socket";
import "./PrivateChat.css";
import TypingIndicator from "./TypingIndicator";

export const PrivateChat = () => {
  const { userId: otherUserId } = useParams();
  const location = useLocation();
  const recipient = location.state;

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const queryClient = useQueryClient();
  const myUserId = user?.data?._id;
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { data: pvtMessages, isLoading, isError, error } = useQuery({
    queryKey: ["privateMessages", myUserId, otherUserId],
    queryFn: () => getPrivateMessages(myUserId, otherUserId),
    enabled: !!myUserId && !!otherUserId,
  });

  useEffect(() => {
    const handlePrivateMessage = () => {
      queryClient.invalidateQueries(["privateMessages", myUserId, otherUserId]);
    };

    socket.on("privateMessage", handlePrivateMessage);

    return () => {
      socket.off("privateMessage", handlePrivateMessage);
    };
  }, [myUserId, otherUserId, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pvtMessages]);

  const handleSend = () => {
    if (!message.trim()) return;

    socket.emit("privateMessage", {
      senderId: myUserId,
      receiverId: otherUserId,
      message,
    });

    queryClient.invalidateQueries(["privateMessages", myUserId, otherUserId]);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  if (isLoading) return <p>Loading chat...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className="private-chat-container">
      <header className="chat-header">
        <p>Chatting with: {recipient.username}</p>
      </header>

      <div className="chat-messages">
        {pvtMessages?.data?.map((msg) => {
          const isOwn = (msg.senderId._id || msg.senderId) === myUserId;
          return (
            <div
              key={msg._id}
              className={`chat-message ${isOwn ? "own" : "other"}`}
            >
              <div className="chat-user">{msg.senderId.username}</div>
              <div className="chat-text">{msg.message}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <TypingIndicator />
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit("typing", {
              room: null,
              username: user?.data?.username,
            })
          }}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
