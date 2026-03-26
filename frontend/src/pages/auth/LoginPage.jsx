import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      pushToast({ message: "Welcome back." });
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Login failed", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Member access</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Sign in to your dashboard</h1>
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
          <button className="button-primary" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-400">
          Need an account? <Link to="/signup" className="text-brand-300">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
