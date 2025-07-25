import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import socket from "../socket/socket";
import { fetchUser, getRoomMessages } from "./services/api";
import MessageInput from "./MessageInput";
import OnlineUsersList from "./OnlineUsersList";
import TypingIndicator from "./TypingIndicator";
import toast from "react-hot-toast";
import "./ChatRoom.css";

export const ChatRoom = () => {
  const { roomName } = useParams();
  const [activeUsers, setActiveUsers] = useState([]);
  const [roomMessages, setRoomMessages] = useState([]);

  const messageEndRef = useRef(null);

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const { data: messagesData } = useQuery({
    queryKey: ["roomMessages", roomName],
    queryFn: () => getRoomMessages(roomName),
    enabled: !!roomName,
  });


  useEffect(() => {
    if (messagesData?.data) {
      setRoomMessages(messagesData.data);
    }
  }, [messagesData]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roomMessages]);


  useEffect(() => {

    socket.on("connection", () => {
      console.log(`Socket connected: ${socket.id}`);
    });
    socket.on("onlinUsers", (userList) => {
      setActiveUsers(userList);
    });

    socket.on("userJoined", (msg) => {
      toast.success(msg);
    });

    socket.on("chatMessage", (newMsg) => {
      console.log("Niw", newMsg);
      setRoomMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off("onlinUsers");
      socket.off("userJoined");
      socket.off("chatMessage");
      socket.off("showTyping")
      socket.off("connection")
    };
  }, []);




  return (
    <div className="chatroom-container">
      <header className="chatroom-header">Room: {roomName}</header>

      <OnlineUsersList users={activeUsers} />



      <div className="message-list">
        {roomMessages.map((msg) => {
          const isOwnMessage = msg.senderId?._id === userData?.data?._id;

          return (
            <div
              key={msg._id}
              className={`message-item ${isOwnMessage ? "own-message" : "other-message"}`}
            >
              <img
                className="avatar"
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.username}_${msg._id}`}
                alt="profile"
              />
              {console.log(msg)
              }
              <div className="message-content">
                <span className="username">{msg.senderId && msg?.senderId?.username}</span>
                <div className="bubble">{msg.message}</div>
              </div>
            </div>
          )
        })}
        <div ref={messageEndRef} />
      </div>

      <TypingIndicator room={roomName} username={userData?.data?.username} />
      <MessageInput room={roomName} username={userData?.data} />
    </div>
  );
};
