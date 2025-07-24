import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API, { withCredentials: true });
export default socket;
