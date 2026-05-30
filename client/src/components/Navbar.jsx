import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded-xl bg-violet-500 px-4 py-2 text-white"
      : "rounded-xl px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white";

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          Habit Tracker
        </h1>

        <div className="flex gap-2">
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/habits" className={linkClass}>
            Habits
          </NavLink>

          <NavLink to="/analytics" className={linkClass}>
            Analytics
          </NavLink>

          <NavLink to="/chat" className={linkClass}>
            Chat
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;