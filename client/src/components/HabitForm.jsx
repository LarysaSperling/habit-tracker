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
    <div className="card mb-8">
      <h2 className="mb-6 text-2xl font-bold">
        Create New Habit
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-3"
      >
        <div>
          <label htmlFor="habitName" className="mb-2 block text-sm muted">
            Habit Name
          </label>

          <input
            id="habitName"
            name="habitName"
            type="text"
            autoComplete="off"
            placeholder="Enter habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm muted">
            Category
          </label>

          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            <option value="health">Health</option>
            <option value="education">Education</option>
            <option value="productivity">Productivity</option>
            <option value="mindfulness">Mindfulness</option>
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className="mb-2 block text-sm muted">
            Difficulty
          </label>

          <select
            id="difficulty"
            name="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="input"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button type="submit" className="btn-primary">
            Create Habit
          </button>
        </div>
      </form>
    </div>
  );
}

export default HabitForm;