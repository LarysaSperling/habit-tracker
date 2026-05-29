import express from "express";
import {
  register,
  login,
  getAuthUser
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", authMiddleware, getAuthUser);

export default router;