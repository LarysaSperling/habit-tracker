import express from "express";
import {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  completeHabit
} from "../controllers/habitController.js";

const router = express.Router();

router.post("/", createHabit);
router.get("/", getHabits);
router.get("/:id", getHabitById);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);
router.post("/:id/complete", completeHabit);

export default router;