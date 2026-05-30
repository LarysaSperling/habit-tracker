import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";

function HabitCard({ habit, onHabitUpdated, onHabitDeleted }) {
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit?.name || "");
  const [editCategory, setEditCategory] = useState(habit?.category || "health");
  const [editDifficulty, setEditDifficulty] = useState(
    habit?.difficulty || "easy"
  );

  if (!habit) return null;

  const completeHabit = async () => {
    try {
      await api.post(`/habits/${habit._id}/complete`, {
        mood,
        notes
      });

      setMood(5);
      setNotes("");

      toast.success("Habit completed!");
      onHabitUpdated();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error completing habit");
    }
  };

  const updateHabit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/habits/${habit._id}`, {
        name: editName,
        category: editCategory,
        difficulty: editDifficulty
      });

      setIsEditing(false);
      toast.success("Habit updated!");
      onHabitUpdated();
    } catch (error) {
      console.error(error);
      toast.error("Error updating habit");
    }
  };

  return (
    <div className="card hover:scale-[1.01]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">{habit.name}</h3>
          <p className="mt-1 text-sm muted">
            {habit.category} • {habit.difficulty}
          </p>
        </div>

        <span className="w-fit rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-400">
          {habit.streak} day streak
        </span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="stat-box">
          <p className="text-xs muted">Current</p>
          <p className="mt-1 text-2xl font-bold">{habit.streak}</p>
        </div>

        <div className="stat-box">
          <p className="text-xs muted">Best</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {habit.bestStreak}
          </p>
        </div>

        <div className="stat-box">
          <p className="text-xs muted">Total</p>
          <p className="mt-1 text-2xl font-bold text-sky-400">
            {habit.totalCompletions}
          </p>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={updateHabit} className="mb-5 grid gap-3">
          <input
            type="text"
            autoComplete="off"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            className="input"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="input"
            >
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
            </select>

            <select
              value={editDifficulty}
              onChange={(e) => setEditDifficulty(e.target.value)}
              className="input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary">
              Save
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-slate-400 px-5 py-3 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <select
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="input"
        >
          <option value={1}>1 - Bad</option>
          <option value={2}>2 - Low</option>
          <option value={3}>3 - Okay</option>
          <option value={4}>4 - Good</option>
          <option value={5}>5 - Great</option>
        </select>

        <input
          type="text"
          autoComplete="off"
          placeholder="Optional note"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button onClick={completeHabit} className="btn-success">
          Complete
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary"
        >
          {isEditing ? "Close" : "Edit"}
        </button>

        <button
          onClick={() => onHabitDeleted(habit._id)}
          className="btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default HabitCard;