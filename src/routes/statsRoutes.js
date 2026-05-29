import express from "express";
import {
  getLongestStreak,
  getBestDay,
  getBestMonth,
  getAbandonedHabits,
  getMoodCorrelation,
  getPerfectDay,
  getGoldenMean,
  getBurnoutHabits,
  getDashboardStats
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/longest-streak", getLongestStreak);
router.get("/best-day", getBestDay);
router.get("/best-month", getBestMonth);
router.get("/abandoned", getAbandonedHabits);
router.get("/mood-correlation", getMoodCorrelation);
router.get("/perfect-day", getPerfectDay);
router.get("/golden-mean", getGoldenMean);
router.get("/burnout", getBurnoutHabits);
router.get("/dashboard", getDashboardStats);

export default router;