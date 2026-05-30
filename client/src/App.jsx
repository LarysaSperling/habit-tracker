import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
