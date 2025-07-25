import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createRoom } from "./services/api";
import "./CreateRoom.css";

export const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (res) => {
      setRoomName("");

    },
    onError: (err) => {
      console.error("Room creation failed:", err);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    createRoomMutation.mutate({ roomName });
  };

  return (
    <div className="create-room-container">
      <h3>➕ Create a New Room</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          disabled={createRoomMutation.isLoading}
        />
        <button type="submit" disabled={createRoomMutation.isLoading}>
          {createRoomMutation.isLoading ? "Creating..." : "Create Room"}
        </button>
      </form>

      {createRoomMutation.isError && (
        <div className="error-message">
          ❌ Failed to create room: {createRoomMutation.error?.message}
        </div>
      )}
      {createRoomMutation.isSuccess && (
        <div className="success-message">
          ✅ Room "{createRoomMutation.data?.data?.name}" created successfully!
        </div>
      )}
    </div>
  );
};
