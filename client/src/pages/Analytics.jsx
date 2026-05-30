import { useEffect, useState } from "react";
import api from "../api/api";
import HabitChart from "../components/HabitChart";

import {
  Flame,
  CalendarDays,
  Trophy,
  Star,
  Scale,
  AlertTriangle,
  BarChart3,
  Moon
} from "lucide-react";

function Analytics() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

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
          abandoned: abandoned.data.data || [],
          mood: mood.data.data || [],
          perfectDay: perfectDay.data.data,
          goldenMean: goldenMean.data.data,
          burnout: burnout.data.data || []
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

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="card border-rose-800 text-rose-300">{error}</div>;
  }

  return (
    <div>
      <section className="mb-10 rounded-3xl bg-gradient-to-r from-sky-600 to-violet-600 p-6 shadow-xl sm:p-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Analytics
        </h1>
        <p className="mt-3 max-w-2xl text-sky-100">
          Explore your habit performance, mood patterns and productivity trends.
        </p>
      </section>

      {stats.mood && stats.mood.length > 0 && (
        <div className="card mb-8">
          <HabitChart moodCorrelation={stats.mood} />
        </div>
      )}

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <div className="card">
          <Flame size={36} className="mb-4 text-orange-400" />
          <p className="text-sm uppercase tracking-wider muted">
            Longest Streak
          </p>
          <h2 className="mt-4 text-2xl font-bold">
            {stats.longest?.name || "No data"}
          </h2>
          <p className="mt-2 text-5xl font-bold text-orange-400">
            {stats.longest?.streak || 0}
          </p>
          <p className="mt-1 text-sm muted">days</p>
        </div>

        <div className="card">
          <CalendarDays size={36} className="mb-4 text-sky-400" />
          <p className="text-sm uppercase tracking-wider muted">Best Day</p>
          <h2 className="mt-4 text-2xl font-bold">
            {stats.bestDay?.dayName || "No data"}
          </h2>
          <p className="mt-2 text-5xl font-bold text-sky-400">
            {stats.bestDay?.count || 0}
          </p>
          <p className="mt-1 text-sm muted">completions</p>
        </div>

        <div className="card">
          <Trophy size={36} className="mb-4 text-emerald-400" />
          <p className="text-sm uppercase tracking-wider muted">Best Month</p>
          <h2 className="mt-4 text-2xl font-bold">
            {stats.bestMonth
              ? `${stats.bestMonth.monthName} ${stats.bestMonth.year}`
              : "No data"}
          </h2>
          <p className="mt-2 text-5xl font-bold text-emerald-400">
            {stats.bestMonth?.completions || 0}
          </p>
          <p className="mt-1 text-sm muted">completions</p>
        </div>

        <div className="card">
          <Star size={36} className="mb-4 text-amber-400" />
          <p className="text-sm uppercase tracking-wider muted">Perfect Day</p>

          {stats.perfectDay ? (
            <>
              <h2 className="mt-4 text-2xl font-bold">
                {stats.perfectDay.date}
              </h2>
              <p className="mt-2 muted">
                {stats.perfectDay.completions} completions
              </p>
              <p className="mt-1 text-amber-400">
                Average mood: {stats.perfectDay.averageMood}
              </p>
            </>
          ) : (
            <p className="mt-4 muted">No data</p>
          )}
        </div>

        <div className="card">
          <Scale size={36} className="mb-4 text-pink-400" />
          <p className="text-sm uppercase tracking-wider muted">Golden Mean</p>

          {stats.goldenMean ? (
            <>
              <h2 className="mt-4 text-2xl font-bold">
                {stats.goldenMean.habit?.name || "No data"}
              </h2>
              <p className="mt-2 muted">
                Habit completions:{" "}
                {stats.goldenMean.habit?.totalCompletions || 0}
              </p>
              <p className="mt-1 text-pink-400">
                Average: {stats.goldenMean.averageCompletions}
              </p>
            </>
          ) : (
            <p className="mt-4 muted">No data</p>
          )}
        </div>

        <div className="card">
          <AlertTriangle size={36} className="mb-4 text-rose-400" />
          <p className="text-sm uppercase tracking-wider muted">
            Burnout Habits
          </p>

          {stats.burnout && stats.burnout.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {stats.burnout.map((habit) => (
                <li key={habit.name} className="stat-box">
                  <p className="font-semibold">{habit.name}</p>
                  <p className="text-sm muted">
                    Streak: {habit.streak} | Total: {habit.totalCompletions}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 muted">No burnout habits</p>
          )}
        </div>
      </section>

      <section className="card mt-6">
        <BarChart3 size={36} className="mb-4 text-violet-400" />
        <p className="text-sm uppercase tracking-wider muted">
          Mood Correlation
        </p>

        {stats.mood && stats.mood.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left">
              <thead>
                <tr className="border-b border-slate-700 muted">
                  <th className="py-3">Difficulty</th>
                  <th className="py-3">Average Mood</th>
                  <th className="py-3">Completions</th>
                </tr>
              </thead>

              <tbody>
                {stats.mood.map((item) => (
                  <tr key={item.difficulty} className="border-b border-slate-700">
                    <td className="py-3 capitalize">{item.difficulty}</td>
                    <td className="py-3 text-emerald-400">
                      {item.averageMood}
                    </td>
                    <td className="py-3 muted">{item.totalCompletions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 muted">No mood data</p>
        )}
      </section>

      <section className="card mt-6">
        <Moon size={36} className="mb-4 text-indigo-400" />
        <p className="text-sm uppercase tracking-wider muted">
          Abandoned Habits
        </p>

        {stats.abandoned && stats.abandoned.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {stats.abandoned.map((habit) => (
              <li key={habit.name} className="stat-box">
                <p className="font-semibold">{habit.name}</p>
                <p className="text-sm muted">
                  {habit.category} • Last completed: {habit.lastCompleted}
                </p>
                <p className="text-sm text-rose-400">
                  {habit.daysSince} days ago
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 muted">No abandoned habits</p>
        )}
      </section>
    </div>
  );
}

export default Analytics;