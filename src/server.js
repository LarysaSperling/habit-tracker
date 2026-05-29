import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

import habitRoutes from "./routes/habitRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import Message from "./models/Message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.use("/habits", habitRoutes);
app.use("/stats", statsRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Habit Tracker API is running" });
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    try {
      const message = await Message.create({
        username: data.username,
        text: data.text
      });

      io.emit("newMessage", message);
    } catch (error) {
      socket.emit("messageError", {
        success: false,
        message: error.message
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3333;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();