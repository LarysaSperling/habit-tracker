import { useEffect, useState } from "react";
import api from "../api/api";
import HabitChart from "../components/HabitChart";

function Analytics() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);

        const [
          longest,
          bestDay,
          bestMonth,
          abandoned,
          mood,
          perfectDay,
          goldenMean,
          burnout
        ] = await Promise.all([
          api.get("/stats/longest-streak"),
          api.get("/stats/best-day"),
          api.get("/stats/best-month"),
          api.get("/stats/abandoned"),
          api.get("/stats/mood-correlation"),
          api.get("/stats/perfect-day"),
          api.get("/stats/golden-mean"),
          api.get("/stats/burnout")
        ]);

        setStats({
          longest: longest.data.data,
          bestDay: bestDay.data.data,
          bestMonth: bestMonth.data.data,
          abandoned: abandoned.data.data,
          mood: mood.data.data || [],
          perfectDay: perfectDay.data.data,
          goldenMean: goldenMean.data.data,
          burnout: burnout.data.data
        });
      } catch (error) {
        console.error(error);
        setError("Error loading analytics");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) return <h2>Loading analytics...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>Analytics</h1>

      {stats.mood && stats.mood.length > 0 && (
        <HabitChart moodCorrelation={stats.mood} />
      )}

      <div>
        <h3>Longest Streak</h3>
        <pre>{JSON.stringify(stats.longest, null, 2)}</pre>
      </div>

      <div>
        <h3>Best Day</h3>
        <pre>{JSON.stringify(stats.bestDay, null, 2)}</pre>
      </div>

      <div>
        <h3>Best Month</h3>
        <pre>{JSON.stringify(stats.bestMonth, null, 2)}</pre>
      </div>

      <div>
        <h3>Abandoned Habits</h3>
        <pre>{JSON.stringify(stats.abandoned, null, 2)}</pre>
      </div>

      <div>
        <h3>Mood Correlation</h3>
        <pre>{JSON.stringify(stats.mood, null, 2)}</pre>
      </div>

      <div>
        <h3>Perfect Day</h3>
        <pre>{JSON.stringify(stats.perfectDay, null, 2)}</pre>
      </div>

      <div>
        <h3>Golden Mean</h3>
        <pre>{JSON.stringify(stats.goldenMean, null, 2)}</pre>
      </div>

      <div>
        <h3>Burnout Habits</h3>
        <pre>{JSON.stringify(stats.burnout, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Analytics;