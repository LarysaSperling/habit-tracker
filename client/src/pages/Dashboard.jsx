import { useEffect, useState } from "react";
import api from "../api/api";

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
        const longestStreakResponse = await api.get(
          "/stats/longest-streak"
        );
        const moodResponse = await api.get(
          "/stats/mood-correlation"
        );

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
    return (
      <h2 className="text-center text-xl">
        Loading dashboard...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="text-center text-red-400">
        {error}
      </h2>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h3 className="text-sm uppercase tracking-wider text-slate-400">
            Total Habits
          </h3>

          <p className="mt-3 text-5xl font-bold">
            {dashboard?.totalHabits || 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h3 className="text-sm uppercase tracking-wider text-slate-400">
            Total Completions
          </h3>

          <p className="mt-3 text-5xl font-bold">
            {dashboard?.totalCompletions || 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h3 className="text-sm uppercase tracking-wider text-slate-400">
            Longest Streak
          </h3>

          <p className="mt-3 text-lg font-semibold text-violet-300">
            {longestStreak?.name || "No data"}
          </p>

          <p className="mt-2 text-5xl font-bold text-violet-400">
            {longestStreak?.streak || 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <h3 className="text-sm uppercase tracking-wider text-slate-400">
            Average Mood
          </h3>

          <p className="mt-3 text-5xl font-bold text-emerald-400">
            {averageMood}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;