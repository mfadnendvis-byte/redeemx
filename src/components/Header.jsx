import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">RedeemX</h1>
      <nav className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
