import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-panel">
      <Link to="/" className="text-lg font-semibold text-accent">
        Ecommerce
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="hover:text-accent transition">Products</Link>
        {user ? (
          <>
            <Link to="/products/new" className="hover:text-accent transition">Add Product</Link>
            <span className="text-gray-400">Hi, {user.name}</span>
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-accent transition">Login</Link>
            <Link to="/register" className="hover:text-accent transition">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
