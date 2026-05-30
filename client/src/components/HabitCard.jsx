import { useState } from "react";
import api from "../api/api";

function HabitCard({
  habit,
  onHabitUpdated,
  onHabitDeleted
}) {
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState("");

  if (!habit) return null;

  const completeHabit = async () => {
    try {
      await api.post(
        `/habits/${habit._id}/complete`,
        {
          mood,
          notes
        }
      );

      setMood(5);
      setNotes("");

      alert("Habit completed!");

      onHabitUpdated();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Error completing habit"
      );
    }
  };

  return (
    <div className="card">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold">
            {habit.name}
          </h3>

          <p className="mt-1 muted">
            {habit.category} • {habit.difficulty}
          </p>
        </div>

        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-400">
          {habit.streak} day streak
        </span>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="stat-box">
          <p className="text-sm muted">
            Current Streak
          </p>

          <p className="mt-2 text-3xl font-bold">
            {habit.streak}
          </p>
        </div>

        <div className="stat-box">
          <p className="text-sm muted">
            Best Streak
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {habit.bestStreak}
          </p>
        </div>

        <div className="stat-box">
          <p className="text-sm muted">
            Total Completions
          </p>

          <p className="mt-2 text-3xl font-bold text-sky-400">
            {habit.totalCompletions}
          </p>
        </div>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-2">
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
            onChange={(e) =>
              setMood(Number(e.target.value))
            }
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
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="input"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={completeHabit}
          className="btn-success"
        >
          Complete Habit
        </button>

        <button
          onClick={() =>
            onHabitDeleted(habit._id)
          }
          className="btn-danger"
        >
          Delete Habit
        </button>
      </div>
    </div>
  );
}

export default HabitCard;