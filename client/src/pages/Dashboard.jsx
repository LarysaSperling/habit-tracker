import { useEffect, useState } from "react";
import api from "../api/api";

import {
  Target,
  Trophy,
  Flame,
  Smile
} from "lucide-react";
import Loader from "../components/Loader";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [longestStreak, setLongestStreak] = useState(null);
  const [moodCorrelation, setMoodCorrelation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const dashboardResponse = await api.get("/stats/dashboard");
        const longestStreakResponse = await api.get("/stats/longest-streak");
        const moodResponse = await api.get("/stats/mood-correlation");

        setDashboard(dashboardResponse.data.data);
        setLongestStreak(longestStreakResponse.data.data);
        setMoodCorrelation(moodResponse.data.data || []);
      } catch (error) {
        console.error(error);
        setError("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const averageMood =
    moodCorrelation.length > 0
      ? (
          moodCorrelation.reduce(
            (sum, item) => sum + item.averageMood,
            0
          ) / moodCorrelation.length
        ).toFixed(1)
      : "0";

 if (loading) {
  return <Loader />;
}

  if (error) {
    return (
      <div className="card border-rose-800 text-rose-300">
        {error}
      </div>
    );
  }

  return (
    <div>
      <section className="mb-10 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-violet-100">
          Track your habits, completions, streaks and mood
          in one clean overview.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="card">
          <Target
            size={36}
            className="mb-4 text-violet-400"
          />

          <p className="text-sm uppercase tracking-wider muted">
            Total Habits
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            {dashboard?.totalHabits || 0}
          </h2>
        </div>

        <div className="card">
          <Trophy
            size={36}
            className="mb-4 text-sky-400"
          />

          <p className="text-sm uppercase tracking-wider muted">
            Total Completions
          </p>

          <h2 className="mt-4 text-5xl font-bold text-sky-400">
            {dashboard?.totalCompletions || 0}
          </h2>
        </div>

        <div className="card">
          <Flame
            size={36}
            className="mb-4 text-orange-400"
          />

          <p className="text-sm uppercase tracking-wider muted">
            Longest Streak
          </p>

          <h2 className="mt-4 text-xl font-bold">
            {longestStreak?.name || "No data"}
          </h2>

          <p className="mt-2 text-5xl font-bold text-orange-400">
            {longestStreak?.streak || 0}
          </p>

          <p className="mt-1 text-sm muted">
            days
          </p>
        </div>

        <div className="card">
          <Smile
            size={36}
            className="mb-4 text-emerald-400"
          />

          <p className="text-sm uppercase tracking-wider muted">
            Average Mood
          </p>

          <h2 className="mt-4 text-5xl font-bold text-emerald-400">
            {averageMood}
          </h2>

          <p className="mt-1 text-sm muted">
            out of 5
          </p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;