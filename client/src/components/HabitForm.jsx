import { useState } from "react";
import api from "../api/api";

function HabitForm({ onHabitCreated }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("health");
  const [difficulty, setDifficulty] = useState("easy");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/habits", {
        name,
        category,
        difficulty
      });

      setName("");
      setCategory("health");
      setDifficulty("easy");

      onHabitCreated();
      alert("Habit created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating habit");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Habit</h2>

      <div>
        <label htmlFor="habitName">Habit name</label>
        <input
          id="habitName"
          name="habitName"
          type="text"
          placeholder="Enter habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="health">health</option>
          <option value="education">education</option>
          <option value="productivity">productivity</option>
          <option value="mindfulness">mindfulness</option>
        </select>
      </div>

      <div>
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          name="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>

      <button type="submit">Create Habit</button>
    </form>
  );
}

export default HabitForm;