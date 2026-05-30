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
    return (
      <div className="rounded-2xl border border-rose-800 bg-rose-950 p-6 text-rose-300">
        {error}
      </div>
    );
  }

  return (
    <div>
      <section className="mb-10 rounded-3xl bg-gradient-to-r from-sky-600 to-violet-600 p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-white">Analytics</h1>
        <p className="mt-3 max-w-2xl text-sky-100">
          Explore your habit performance, mood patterns and productivity trends.
        </p>
      </section>

      {stats.mood && stats.mood.length > 0 && (
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <HabitChart moodCorrelation={stats.mood} />
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-violet-500">
          <p className="text-sm uppercase tracking-wider text-slate-400">
            🔥 Longest Streak
          </p>

          <h2 className="mt-4 text-2xl font-bold text-white">
            {stats.longest?.name || "No data"}
          </h2>

          <p className="mt-2 text-5xl font-bold text-violet-400">
            {stats.longest?.streak || 0}
          </p>

          <p className="mt-1 text-sm text-slate-400">days</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-sky-500">
          <p className="text-sm uppercase tracking-wider text-slate-400">
            📅 Best Day
          </p>

          <h2 className="mt-4 text-2xl font-bold text-white">
            {stats.bestDay?.dayName || "No data"}
          </h2>

          <p className="mt-2 text-5xl font-bold text-sky-400">
            {stats.bestDay?.count || 0}
          </p>

          <p className="mt-1 text-sm text-slate-400">completions</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-emerald-500">
          <p className="text-sm uppercase tracking-wider text-slate-400">
            🏆 Best Month
          </p>

          <h2 className="mt-4 text-2xl font-bold text-white">
            {stats.bestMonth
              ? `${stats.bestMonth.monthName} ${stats.bestMonth.year}`
              : "No data"}
          </h2>

          <p className="mt-2 text-5xl font-bold text-emerald-400">
            {stats.bestMonth?.completions || 0}
          </p>

          <p className="mt-1 text-sm text-slate-400">completions</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-amber-500">
          <p className="text-sm uppercase tracking-wider text-slate-400">
            ⭐ Perfect Day
          </p>

          {stats.perfectDay ? (
            <>
              <h2 className="mt-4 text-2xl font-bold text-white">
                {stats.perfectDay.date}
              </h2>

              <p className="mt-2 text-slate-300">
                {stats.perfectDay.completions} completions
              </p>

              <p className="mt-1 text-amber-400">
                Average mood: {stats.perfectDay.averageMood}
              </p>
            </>
          ) : (
            <p className="mt-4 text-slate-400">No data</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-pink-500">
          <p className="text-sm uppercase tracking-wider text-slate-400">
            ⚖️ Golden Mean
          </p>

          {stats.goldenMean ? (
            <>
              <h2 className="mt-4 text-2xl font-bold text-white">
                {stats.goldenMean.habit?.name || "No data"}
              </h2>

              <p className="mt-2 text-slate-300">
                Habit completions:{" "}
                {stats.goldenMean.habit?.totalCompletions || 0}
              </p>

              <p className="mt-1 text-pink-400">
                Average: {stats.goldenMean.averageCompletions}
              </p>
            </>
          ) : (
            <p className="mt-4 text-slate-400">No data</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:border-rose-500">
          <p className="text-sm uppercase tracking-wider text-slate-400">
            😵 Burnout Habits
          </p>

          {stats.burnout && stats.burnout.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {stats.burnout.map((habit) => (
                <li
                  key={habit.name}
                  className="rounded-xl bg-slate-800 p-4"
                >
                  <p className="font-semibold text-white">{habit.name}</p>
                  <p className="text-sm text-slate-400">
                    Streak: {habit.streak} | Total: {habit.totalCompletions}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-slate-400">No burnout habits</p>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-sm uppercase tracking-wider text-slate-400">
          📊 Mood Correlation
        </p>

        {stats.mood && stats.mood.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3">Difficulty</th>
                  <th className="py-3">Average Mood</th>
                  <th className="py-3">Completions</th>
                </tr>
              </thead>

              <tbody>
                {stats.mood.map((item) => (
                  <tr
                    key={item.difficulty}
                    className="border-b border-slate-800"
                  >
                    <td className="py-3 capitalize text-white">
                      {item.difficulty}
                    </td>
                    <td className="py-3 text-emerald-400">
                      {item.averageMood}
                    </td>
                    <td className="py-3 text-slate-300">
                      {item.totalCompletions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-slate-400">No mood data</p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <p className="text-sm uppercase tracking-wider text-slate-400">
          💤 Abandoned Habits
        </p>

        {stats.abandoned && stats.abandoned.length > 0 ? (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {stats.abandoned.map((habit) => (
              <li
                key={habit.name}
                className="rounded-xl bg-slate-800 p-4"
              >
                <p className="font-semibold text-white">{habit.name}</p>
                <p className="text-sm text-slate-400">
                  {habit.category} • Last completed: {habit.lastCompleted}
                </p>
                <p className="text-sm text-rose-400">
                  {habit.daysSince} days ago
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-400">No abandoned habits</p>
        )}
      </section>
    </div>
  );
}

export default Analytics;