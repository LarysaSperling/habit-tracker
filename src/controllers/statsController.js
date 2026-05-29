import Habit from "../models/Habit.js";
import Progress from "../models/Progress.js";

const dayNames = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday"
};

const monthNames = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

export const getLongestStreak = async (req, res) => {
  try {
    const habit = await Habit.findOne().sort({ streak: -1 });

    res.json({
      success: true,
      message: "Habit with the longest current streak",
      data: habit
        ? {
            name: habit.name,
            streak: habit.streak,
            category: habit.category,
            difficulty: habit.difficulty
          }
        : null
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

    const bestDay = result[0];

    res.json({
      success: true,
      message: "Most productive day of the week",
      data: bestDay
        ? {
            dayName: dayNames[bestDay._id],
            count: bestDay.count
          }
        : null
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

    const bestMonth = result[0];

    res.json({
      success: true,
      message: "Most productive month",
      data: bestMonth
        ? {
            monthName: monthNames[bestMonth._id.month],
            year: bestMonth._id.year,
            completions: bestMonth.completions
          }
        : null
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
      { $match: { completed: true } },
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
      },
      {
        $lookup: {
          from: "habits",
          localField: "_id",
          foreignField: "_id",
          as: "habit"
        }
      },
      { $unwind: "$habit" }
    ]);

    const data = result.map((item) => {
      const daysSince = Math.floor(
        (new Date() - item.lastCompleted) / (1000 * 60 * 60 * 24)
      );

      return {
        name: item.habit.name,
        category: item.habit.category,
        lastCompleted: item.lastCompleted.toISOString().split("T")[0],
        daysSince
      };
    });

    res.json({
      success: true,
      message: "Abandoned habits that were not completed for more than 7 days",
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoodCorrelation = async (req, res) => {
  try {
    const result = await Progress.aggregate([
      { $match: { completed: true, mood: { $ne: null } } },
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
      },
      { $sort: { _id: 1 } }
    ]);

    const data = result.map((item) => ({
      difficulty: item._id,
      averageMood: Number(item.averageMood.toFixed(1)),
      totalCompletions: item.totalCompletions
    }));

    res.json({
      success: true,
      message: "Average mood by habit difficulty",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPerfectDay = async (req, res) => {
  try {
    const result = await Progress.aggregate([
      { $match: { completed: true, mood: { $ne: null } } },
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
      { $sort: { completions: -1, averageMood: -1 } },
      { $limit: 1 }
    ]);

    const perfectDay = result[0];

    res.json({
      success: true,
      message: "Perfect day with maximum habits and good mood",
      data: perfectDay
        ? {
            date: perfectDay._id,
            completions: perfectDay.completions,
            averageMood: Number(perfectDay.averageMood.toFixed(1))
          }
        : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGoldenMean = async (req, res) => {
  try {
    const habits = await Habit.find();

    if (habits.length === 0) {
      return res.json({
        success: true,
        message: "No habits found",
        data: null
      });
    }

    const averageCompletions =
      habits.reduce((sum, habit) => sum + habit.totalCompletions, 0) /
      habits.length;

    let closestHabit = null;
    let smallestDifference = Infinity;

    habits.forEach((habit) => {
      const difference = Math.abs(habit.totalCompletions - averageCompletions);

      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestHabit = habit;
      }
    });

    res.json({
      success: true,
      message: "Habit closest to average completions",
      data: {
        habit: {
          name: closestHabit.name,
          totalCompletions: closestHabit.totalCompletions
        },
        averageCompletions: Number(averageCompletions.toFixed(1)),
        difference: Number(smallestDifference.toFixed(1))
      }
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

    const data = habits.map((habit) => ({
      name: habit.name,
      streak: habit.streak,
      totalCompletions: habit.totalCompletions,
      difference: habit.streak - habit.totalCompletions
    }));

    res.json({
      success: true,
      message: "Habits at risk of burnout",
      count: data.length,
      data
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
      { $match: { completed: true, mood: { $ne: null } } },
      {
        $group: {
          _id: null,
          averageMood: { $avg: "$mood" }
        }
      }
    ]);

    res.json({
      success: true,
      message: "Dashboard statistics",
      data: {
        totalHabits,
        totalCompletions,
        bestHabit: bestHabit
          ? {
              name: bestHabit.name,
              bestStreak: bestHabit.bestStreak,
              category: bestHabit.category
            }
          : null,
        averageMood: mood[0]?.averageMood
          ? Number(mood[0].averageMood.toFixed(1))
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};