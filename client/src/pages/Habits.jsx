import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";
import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/habits");
      setHabits(response.data.data || []);
    } catch (error) {
      console.error(error);
      setError("Error loading habits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const deleteHabit = async (id) => {
    const confirmDelete = window.confirm("Delete this habit?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/habits/${id}`);

      toast.success("Habit deleted successfully!");

      await fetchHabits();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting habit");
    }
  };

  const filteredHabits = habits.filter((habit) => {
    const categoryMatch =
      !categoryFilter || habit.category === categoryFilter;

    const difficultyMatch =
      !difficultyFilter || habit.difficulty === difficultyFilter;

    const searchMatch = habit.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && difficultyMatch && searchMatch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Habits</h1>

        <p className="mt-2 muted">
          Create, complete and track your daily habits.
        </p>
      </div>

      <HabitForm onHabitCreated={fetchHabits} />

      <div className="card mb-6">
        <h2 className="mb-4 text-xl font-bold">Search & Filters</h2>

        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label htmlFor="search" className="mb-2 block text-sm muted">
              Search
            </label>

            <input
              id="search"
              name="search"
              type="text"
              autoComplete="off"
              placeholder="Search by habit name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="categoryFilter"
              className="mb-2 block text-sm muted"
            >
              Category
            </label>

            <select
              id="categoryFilter"
              name="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="">All categories</option>
              <option value="health">Health</option>
              <option value="education">Education</option>
              <option value="productivity">Productivity</option>
              <option value="mindfulness">Mindfulness</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="difficultyFilter"
              className="mb-2 block text-sm muted"
            >
              Difficulty
            </label>

            <select
              id="difficultyFilter"
              name="difficultyFilter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input"
            >
              <option value="">All difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <Loader />}

      {error && (
        <div className="card border-rose-800 text-rose-300">{error}</div>
      )}

      {!loading && !error && habits.length === 0 && (
        <EmptyState
          icon="🌱"
          title="No habits yet"
          text="Create your first habit and start tracking your progress."
        />
      )}

      {!loading && !error && habits.length > 0 && filteredHabits.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No matching habits"
          text="Try changing the category, difficulty or search text."
        />
      )}

      {!loading && !error && filteredHabits.length > 0 && (
        <>
          <p className="mb-4 muted">
            Found {filteredHabits.length} habit(s)
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onHabitUpdated={fetchHabits}
                onHabitDeleted={deleteHabit}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Habits;