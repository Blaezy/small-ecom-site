import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors.map((er) => er.message));
      } else {
        setErrors([err.response?.data?.message || "Registration failed"]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 card">
      <h1 className="text-xl font-semibold mb-4">Create an account</h1>

      {errors.length > 0 && (
        <ul className="mb-4 text-sm text-red-400 list-disc list-inside space-y-1">
          {errors.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className="w-full" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full" required />
        <input name="confirmPassword" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} className="w-full" required />
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-4">
        Already have an account? <Link to="/login" className="text-accent">Login</Link>
      </p>
    </div>
  );
};

export default Register;
