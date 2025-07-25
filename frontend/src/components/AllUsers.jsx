
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "./services/api";
import { useNavigate } from "react-router-dom";
import "./AllUsers.css";

export const AllUsers = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const users = data?.data || [];

  const handleUserClick = (user) => {
    navigate(`/private/${user._id}`, {
      state: {
        username: user.username,
      },
    });
  };


  return (
    <div className="users-container">
      <h2>💬 Start a Private Chat</h2>
      <div className="user-list">
        {users.map((user) => (
          <div
            key={user._id}
            className="user-card"
            onClick={() => handleUserClick(user)}
          >
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <div className="username">{user.username}</div>
              <div className="email">{user.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
