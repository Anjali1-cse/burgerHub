import React, { useState } from "react";
import { API } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.name || !form.email || !form.password) return setErr("Fill all fields");
    if (form.password !== form.confirm) return setErr("Passwords do not match");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", { name: form.name, email: form.email, password: form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {err && <p className="error">{err}</p>}
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <input type="password" name="confirm" placeholder="Confirm Password" value={form.confirm} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
