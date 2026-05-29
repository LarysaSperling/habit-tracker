import Habit from "../models/Habit.js";
import Progress from "../models/Progress.js";

export const getLongestStreak = async (req, res) => {
  try {
    const habit = await Habit.findOne().sort({ streak: -1 });

    res.json({
      success: true,
      message: "Habit with the longest streak",
      data: habit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestDay = async (req, res) => {
  try {
    const result = await Progress.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      success: true,
      message: "Best day of week",
      data: result[0] || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBestMonth = async (req, res) => {
  try {
    const result = await Progress.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          completions: { $sum: 1 }
        }
      },
      { $sort: { completions: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      success: true,
      message: "Best month",
      data: result[0] || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAbandonedHabits = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await Progress.aggregate([
      {
        $group: {
          _id: "$habitId",
          lastCompleted: { $max: "$date" }
        }
      },
      {
        $match: {
          lastCompleted: { $lt: sevenDaysAgo }
        }
      }
    ]);

    res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoodCorrelation = async (req, res) => {
  try {
    const result = await Progress.aggregate([
      {
        $lookup: {
          from: "habits",
          localField: "habitId",
          foreignField: "_id",
          as: "habit"
        }
      },
      { $unwind: "$habit" },
      {
        $group: {
          _id: "$habit.difficulty",
          averageMood: { $avg: "$mood" },
          totalCompletions: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      message: "Mood correlation",
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerfectDay = async (req, res) => {
  try {
    const result = await Progress.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date"
            }
          },
          completions: { $sum: 1 },
          averageMood: { $avg: "$mood" }
        }
      },
      {
        $match: {
          averageMood: { $gt: 4 }
        }
      },
      { $sort: { completions: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      success: true,
      message: "Perfect day",
      data: result[0] || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGoldenMean = async (req, res) => {
  try {
    const habits = await Habit.find();

    const avg =
      habits.reduce((sum, habit) => sum + habit.totalCompletions, 0) /
      habits.length;

    let closest = null;
    let minDiff = Infinity;

    habits.forEach((habit) => {
      const diff = Math.abs(habit.totalCompletions - avg);

      if (diff < minDiff) {
        minDiff = diff;
        closest = habit;
      }
    });

    res.json({
      success: true,
      averageCompletions: avg,
      habit: closest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBurnoutHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      $expr: {
        $gt: ["$streak", "$totalCompletions"]
      }
    });

    res.json({
      success: true,
      count: habits.length,
      data: habits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalHabits = await Habit.countDocuments();

    const totalCompletions = await Progress.countDocuments({
      completed: true
    });

    const bestHabit = await Habit.findOne().sort({
      bestStreak: -1
    });

    const mood = await Progress.aggregate([
      {
        $group: {
          _id: null,
          averageMood: { $avg: "$mood" }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalHabits,
        totalCompletions,
        bestHabit,
        averageMood: mood[0]?.averageMood || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};