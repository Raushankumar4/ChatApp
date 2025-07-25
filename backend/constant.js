import dotenv from "dotenv";
dotenv.config();

export const options = {
  cors: {
    origin: process.env.CLIENT_URI || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
};

export const corsOptions = {
  origin: process.env.CLIENT_URI || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
