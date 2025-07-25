import http from "http";
import { Server } from "socket.io";
import express from "express";
import { corsOptions, options } from "./constant.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleSocket } from "./socket/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, options);

// Socket Connection
handleSocket(io);

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);

app.get("/", (_, res) => {
  res.send("Server is Running");
});

app.use(errorHandler);

// Starting the server after DB connection
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
