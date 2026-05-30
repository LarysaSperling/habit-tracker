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
          moodCorrelation.reduce((sum, item) => sum + item.averageMood, 0) /
          moodCorrelation.length
        ).toFixed(1)
      : "0";

  return (
    <div>
      <h1>Dashboard</h1>

      {loading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && dashboard && (
        <div>
          <div>
            <h3>Total habits</h3>
            <p>{dashboard.totalHabits}</p>
          </div>

          <div>
            <h3>Total completions</h3>
            <p>{dashboard.totalCompletions}</p>
          </div>

          <div>
            <h3>Longest streak</h3>
            {longestStreak ? (
              <p>
                {longestStreak.name} — {longestStreak.streak} days
              </p>
            ) : (
              <p>No data</p>
            )}
          </div>

          <div>
            <h3>Average mood</h3>
            <p>{averageMood}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;