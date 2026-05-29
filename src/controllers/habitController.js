import Habit from "../models/Habit.js";
import Progress from "../models/Progress.js";

export const createHabit = async (req, res) => {
  try {
    const { name, category, difficulty } = req.body;

    const habit = await Habit.create({
      name,
      category,
      difficulty
    });

    res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: habit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find();

    res.json({
      success: true,
      count: habits.length,
      data: habits
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }

    res.json({
      success: true,
      data: habit
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }

    res.json({
      success: true,
      message: "Habit updated successfully",
      data: habit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findByIdAndDelete(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }

    await Progress.deleteMany({ habitId: req.params.id });

    res.json({
      success: true,
      message: "Habit deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const alreadyCompleted = await Progress.findOne({
      habitId: habit._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: "Habit already completed today"
      });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const completedYesterday = await Progress.findOne({
      habitId: habit._id,
      date: { $gte: yesterday, $lt: today }
    });

    habit.streak = completedYesterday ? habit.streak + 1 : 1;
    habit.bestStreak = Math.max(habit.bestStreak, habit.streak);
    habit.totalCompletions += 1;

    await habit.save();

    const progress = await Progress.create({
      habitId: habit._id,
      completed: true,
      notes: req.body.notes || "",
      mood: req.body.mood
    });

    res.status(201).json({
      success: true,
      message: "Habit completed successfully",
      data: {
        habit,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};