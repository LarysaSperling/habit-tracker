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
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        marginBottom: "10px"
      }}
    >
      <h3>{habit.name}</h3>

      <p>Category: {habit.category}</p>
      <p>Difficulty: {habit.difficulty}</p>
      <p>Current streak: {habit.streak}</p>
      <p>Best streak: {habit.bestStreak}</p>
      <p>Total completions: {habit.totalCompletions}</p>

      <div>
        <label htmlFor={`mood-${habit._id}`}>Mood</label>
        <select
          id={`mood-${habit._id}`}
          name={`mood-${habit._id}`}
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>

      <div>
        <label htmlFor={`notes-${habit._id}`}>Notes</label>
        <input
          id={`notes-${habit._id}`}
          name={`notes-${habit._id}`}
          type="text"
          placeholder="Optional note"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button onClick={completeHabit}>Complete</button>

      <button onClick={() => onHabitDeleted(habit._id)}>
        Delete
      </button>
    </div>
  );
}

export default HabitCard;