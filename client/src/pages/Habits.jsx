import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const confirmDelete = window.confirm(
      "Delete this habit?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/habits/${id}`);
      await fetchHabits();
    } catch (error) {
      console.error(error);
      alert("Error deleting habit");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Habits
        </h1>

        <p className="mt-2 muted">
          Create, complete and track your daily habits.
        </p>
      </div>

      <HabitForm onHabitCreated={fetchHabits} />

      {loading && (
        <div className="card">
          Loading habits...
        </div>
      )}

      {error && (
        <div className="card border-rose-800 text-rose-300">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        habits.length === 0 && (
          <div className="card muted">
            No habits found. Create your first
            habit above.
          </div>
        )}

      {!loading && habits.length > 0 && (
        <div className="grid gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onHabitUpdated={fetchHabits}
              onHabitDeleted={deleteHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Habits;