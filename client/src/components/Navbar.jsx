import { NavLink } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded-xl bg-violet-500 px-4 py-2 text-white"
      : darkMode
      ? "rounded-xl px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
      : "rounded-xl px-4 py-2 text-slate-700 hover:bg-white hover:text-violet-600";

  return (
    <header
      className={
        darkMode
          ? "border-b border-slate-800 bg-slate-950/80 px-6 py-4"
          : "border-b border-slate-200 bg-slate-100 px-6 py-4"
      }
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className={darkMode ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-950"}>
          Habit Tracker
        </h1>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/habits" className={linkClass}>Habits</NavLink>
          <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
          <NavLink to="/chat" className={linkClass}>Chat</NavLink>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="ml-3 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;