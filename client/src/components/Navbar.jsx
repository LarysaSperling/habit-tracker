import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded-xl bg-violet-500 px-4 py-2 text-white"
      : darkMode
      ? "rounded-xl px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
      : "rounded-xl px-4 py-2 text-slate-700 hover:bg-white hover:text-violet-600";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      className={
        darkMode
          ? "sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur"
          : "sticky top-0 z-50 border-b border-slate-200 bg-slate-100/90 px-6 py-4 backdrop-blur"
      }
    >
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between">
        <NavLink
          to="/"
          onClick={closeMenu}
          className={
            darkMode
              ? "text-xl font-bold text-white"
              : "text-xl font-bold text-slate-950"
          }
        >
          Habit Tracker
        </NavLink>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className={
            darkMode
              ? "rounded-xl p-2 text-white hover:bg-slate-800 md:hidden"
              : "rounded-xl p-2 text-slate-950 hover:bg-white md:hidden"
          }
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={
            menuOpen
              ? darkMode
                ? "absolute left-0 top-14 flex w-full flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none"
                : "absolute left-0 top-14 flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none"
              : "hidden items-center gap-2 md:flex"
          }
        >
          <NavLink to="/" onClick={closeMenu} className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/habits" onClick={closeMenu} className={linkClass}>
            Habits
          </NavLink>

          <NavLink to="/analytics" onClick={closeMenu} className={linkClass}>
            Analytics
          </NavLink>

          <NavLink to="/chat" onClick={closeMenu} className={linkClass}>
            Chat
          </NavLink>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500 md:ml-3 md:mt-0"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;