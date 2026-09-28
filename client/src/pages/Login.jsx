import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 card">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full" required />
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-4">
        No account yet? <Link to="/register" className="text-accent">Register</Link>
      </p>
    </div>
  );
};

export default Login;
