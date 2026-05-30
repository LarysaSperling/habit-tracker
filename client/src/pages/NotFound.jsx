import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card max-w-lg text-center">
        <h1 className="text-7xl font-bold text-violet-500">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold">
          Page Not Found
        </h2>

        <p className="mt-4 muted">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="btn-primary mt-6 inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;