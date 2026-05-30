import { useState } from "react";
import api from "../api/api";

function HabitCard({ habit, onHabitUpdated, onHabitDeleted }) {
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState("");

  const completeHabit = async () => {
    try {
      await api.post(`/habits/${habit._id}/complete`, {
        mood,
        notes
      });

      setNotes("");
      setMood(5);

      alert("Habit completed!");
      onHabitUpdated();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error completing habit");
    }
  };

  if (!habit) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-violet-500">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">
            {habit.name}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {habit.category} • {habit.difficulty}
          </p>
        </div>

        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300">
          {habit.streak} day streak
        </span>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Current</p>
          <p className="text-2xl font-bold">{habit.streak}</p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Best</p>
          <p className="text-2xl font-bold text-emerald-400">
            {habit.bestStreak}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total</p>
          <p className="text-2xl font-bold text-sky-400">
            {habit.totalCompletions}
          </p>
        </div>
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor={`mood-${habit._id}`}
            className="mb-2 block text-sm text-slate-400"
          >
            Mood
          </label>

          <select
            id={`mood-${habit._id}`}
            name={`mood-${habit._id}`}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-violet-500"
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
            className="mb-2 block text-sm text-slate-400"
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
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={completeHabit}
          className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500"
        >
          Complete
        </button>

        <button
          onClick={() => onHabitDeleted(habit._id)}
          className="rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default HabitCard;