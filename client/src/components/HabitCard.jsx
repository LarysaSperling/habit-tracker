import { useState } from "react";
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

      alert("Habit completed!");
      onHabitUpdated();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error completing habit");
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
      alert("Habit updated!");
      onHabitUpdated();
    } catch (error) {
      console.error(error);
      alert("Error updating habit");
    }
  };

  return (
    <div className="card">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-2xl font-bold">{habit.name}</h3>

          <p className="mt-1 muted">
            {habit.category} • {habit.difficulty}
          </p>
        </div>

        <span className="w-fit rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-400">
          {habit.streak} day streak
        </span>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className="stat-box">
          <p className="text-sm muted">Current</p>
          <p className="mt-2 text-3xl font-bold">{habit.streak}</p>
        </div>

        <div className="stat-box">
          <p className="text-sm muted">Best</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {habit.bestStreak}
          </p>
        </div>

        <div className="stat-box">
          <p className="text-sm muted">Total</p>
          <p className="mt-2 text-3xl font-bold text-sky-400">
            {habit.totalCompletions}
          </p>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={updateHabit} className="mb-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor={`edit-name-${habit._id}`}
              className="mb-2 block text-sm muted"
            >
              Name
            </label>

            <input
              id={`edit-name-${habit._id}`}
              name={`edit-name-${habit._id}`}
              type="text"
              autoComplete="off"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor={`edit-category-${habit._id}`}
              className="mb-2 block text-sm muted"
            >
              Category
            </label>

            <select
              id={`edit-category-${habit._id}`}
              name={`edit-category-${habit._id}`}
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="input"
            >
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
            </select>
          </div>

          <div>
            <label
              htmlFor={`edit-difficulty-${habit._id}`}
              className="mb-2 block text-sm muted"
            >
              Difficulty
            </label>

            <select
              id={`edit-difficulty-${habit._id}`}
              name={`edit-difficulty-${habit._id}`}
              value={editDifficulty}
              onChange={(e) => setEditDifficulty(e.target.value)}
              className="input"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 sm:col-span-3 sm:flex-row">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-slate-400 px-5 py-3 font-semibold transition hover:bg-slate-200 hover:text-slate-950 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`mood-${habit._id}`}
            className="mb-2 block text-sm muted"
          >
            Mood
          </label>

          <select
            id={`mood-${habit._id}`}
            name={`mood-${habit._id}`}
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
        </div>

        <div>
          <label
            htmlFor={`notes-${habit._id}`}
            className="mb-2 block text-sm muted"
          >
            Notes
          </label>

          <input
            id={`notes-${habit._id}`}
            name={`notes-${habit._id}`}
            type="text"
            autoComplete="off"
            placeholder="Optional note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:flex sm:flex-wrap">
        <button onClick={completeHabit} className="btn-success w-full sm:w-auto">
          Complete
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary w-full sm:w-auto"
        >
          {isEditing ? "Close Edit" : "Edit"}
        </button>

        <button
          onClick={() => onHabitDeleted(habit._id)}
          className="btn-danger w-full sm:w-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default HabitCard;