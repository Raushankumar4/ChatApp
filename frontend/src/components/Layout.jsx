import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUser, logout } from "./services/api";
import { Rooms } from "./Rooms";
import "./Layout.css";
import { CreateRoom } from "./CreateRoom";
import { AllUsers } from "./AllUsers";
import socket from "../socket/socket";

export const Layout = () => {
  const [active, setActive] = useState("rooms");
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const myUserId = userData?.data?._id;


  useEffect(() => {
    if (myUserId) {
      socket.emit("connected", myUserId);
    }
  }, [myUserId]);


  useEffect(() => {
    socket.on("connection", () => {
      console.log(`Socket connected: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const logoutUser = useMutation({
    mutationKey: ["user"],
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token")
      navigate("/");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    }
  });

  const renderContent = () => {
    switch (active) {
      case "rooms":
        return <Rooms />;
      case "create-room":
        return <div><CreateRoom /></div>;
      case "users":
        return <div><AllUsers /></div>;
      default:
        return null;
    }
  };

  return (
    <>

      <nav className="navbar">
        <ul className="navList">
          <li>
            <button
              className={`navButton ${active === "rooms" ? "active" : ""}`}
              onClick={() => setActive("rooms")}
            >
              Rooms
            </button>
          </li>
          <li>
            <button
              className={`navButton ${active === "create-room" ? "active" : ""}`}
              onClick={() => setActive("create-room")}
            >
              Create Room
            </button>
          </li>
          <li>
            <button
              className={`navButton ${active === "users" ? "active" : ""}`}
              onClick={() => setActive("users")}
            >
              Users
            </button>
          </li>
          <li>
            <button
              className="navButton"
              onClick={() => logoutUser.mutate()}
              disabled={logoutUser.isLoading}
            >
              {logoutUser.isLoading ? "Logging out..." : "Logout"}
            </button>
          </li>
        </ul>
      </nav>

      {logoutUser.isError && (
        <div className="errorMessage">
          ❌ Logout failed: {logoutUser.error?.message || "Unknown error"}
        </div>
      )}

      <main className="contentArea">{renderContent()}</main>
    </>
  );
};
