import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

import habitRoutes from "./routes/habitRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import Message from "./models/Message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

app.use("/habits", habitRoutes);
app.use("/stats", statsRoutes);
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Habit Tracker API is running" });
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