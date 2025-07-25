import axiosInstance from "./axiosInstance";

export const registerUser = (data) => axiosInstance.post("auth/register", data);
export const loginUser = (data) => axiosInstance.post("auth/login", data);
export const logout = () => axiosInstance.post("auth/logout");

export const fetchUser = () => axiosInstance.get("auth/user");

export const createRoom = (data) =>
  axiosInstance.post("chat/create-room", data);

export const getAllRooms = () => axiosInstance.get("chat/rooms");

export const getAllUsers = () => axiosInstance.get("auth/users");

export const getPrivateMessages = (user1, user2) => {
  return axiosInstance.get("chat/messages", {
    params: { user1, user2 },
  });
};

export const sendPrivateMessage = (data) =>
  axiosInstance.post(`chat/send-msg`, data);

export const getRoomMessages = (roomName) =>
  axiosInstance.get(`chat/messages/room/${roomName}`);
