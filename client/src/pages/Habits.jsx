import { useEffect, useState } from "react";
import api from "../api/api";
import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/habits");
      const habitsData = response.data.data || [];

      setHabits(habitsData.filter(Boolean));
    } catch (error) {
      console.error(error);
      setError("Error loading habits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const deleteHabit = async (id) => {
    const confirmDelete = window.confirm("Delete this habit?");
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
      <HabitForm onHabitCreated={fetchHabits} />

      <h1>Habits</h1>

      {loading && <p>Loading habits...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && habits.length === 0 && <p>No habits found.</p>}

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
    </div>
  );
}

export default Habits;