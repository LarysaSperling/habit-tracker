import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import habitRoutes from "./routes/habitRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/habits", habitRoutes);
app.use("/stats", statsRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Habit Tracker API is running" });
});

const PORT = process.env.PORT || 3333;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();