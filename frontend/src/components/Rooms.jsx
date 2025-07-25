import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "./services/api";
import socket from "../socket/socket";
import "./Rooms.css";
import { useNavigate } from "react-router-dom";

export const Rooms = ({ username = "raj" }) => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rooms"],
    queryFn: getAllRooms,
  });


  if (isLoading) return <p>Loading rooms...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const rooms = data?.data?.data || [];

  const handleJoin = (roomName) => {
    if (!username) {
      alert("Username is required to join rooms.");
      return;
    }
    socket.emit("joinRoom", { username, room: roomName });
    navigate(`/chat/${roomName}`);
  };

  return (
    <div className="rooms-container">
      <h1>Available Rooms</h1>
      <ul className="rooms-list">
        {rooms.map((room) => (
          <li key={room._id} className="room-card">
            <div className="room-info">
              <span className="room-name">{room.roomName}</span>
              {room.userId?.username && (
                <span className="creator-name">
                  Created by {room.userId.username}
                </span>
              )}
            </div>
            <button onClick={() => handleJoin(room.roomName)} className="join-btn">
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
