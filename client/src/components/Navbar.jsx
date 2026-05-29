import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link> |{" "}
      <Link to="/habits">Habits</Link> |{" "}
      <Link to="/analytics">Analytics</Link> |{" "}
      <Link to="/chat">Chat</Link>
    </nav>
  );
}

export default Navbar;