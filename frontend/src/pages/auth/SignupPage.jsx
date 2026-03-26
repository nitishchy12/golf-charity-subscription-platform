import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { charityApi } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [charitiesLoading, setCharitiesLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    subscriptionStatus: true,
    subscriptionType: "monthly",
    charityId: "",
    charityPercentage: 10
  });

  useEffect(() => {
    const loadCharities = async () => {
      try {
        const { data } = await charityApi.list();
        setCharities(data.data);
        if (data.data[0]) {
          setForm((current) => ({ ...current, charityId: data.data[0]._id }));
        }
      } catch (error) {
        pushToast({ message: error.response?.data?.message || "Could not load charities", variant: "error" });
      } finally {
        setCharitiesLoading(false);
      }
    };

    loadCharities();
  }, [pushToast]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const charityUnavailable = useMemo(() => !charitiesLoading && charities.length === 0, [charitiesLoading, charities.length]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (charityUnavailable) {
      pushToast({ message: "No charities available yet. Restart backend once and try again.", variant: "error" });
      return;
    }

    setLoading(true);
    try {
      await signup({
        ...form,
        charityPercentage: Number(form.charityPercentage)
      });
      pushToast({ message: "Account created successfully." });
      navigate("/dashboard");
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Signup failed", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-mesh p-10 lg:block">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Join the draw</p>
          <h1 className="mt-6 text-4xl font-semibold text-white">Membership that powers golf rewards and charity giving.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">Create your account, choose a charity, activate your subscription, and start locking in scores for the monthly draw.</p>
        </div>
        <div className="p-6 sm:p-10">
          <h2 className="text-3xl font-semibold text-white">Create account</h2>
          <p className="mt-2 text-sm text-slate-400">Production-style onboarding with charity and subscription setup.</p>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <input className="input" name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
            <input className="input" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input className="input" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <select className="input" name="charityId" value={form.charityId} onChange={handleChange} required disabled={charitiesLoading || charityUnavailable}>
              <option value="">{charitiesLoading ? "Loading charities..." : charityUnavailable ? "No charities available" : "Select charity"}</option>
              {charities.map((charity) => (
                <option key={charity._id} value={charity._id}>
                  {charity.name}
                </option>
              ))}
            </select>
            {charityUnavailable ? <p className="text-xs text-amber-300">Starter charities will appear after the backend reconnects to MongoDB and boots once.</p> : null}
            <input className="input" type="number" min="10" max="100" name="charityPercentage" placeholder="Charity %" value={form.charityPercentage} onChange={handleChange} required />
            <select className="input" name="subscriptionType" value={form.subscriptionType} onChange={handleChange}>
              <option value="monthly">Monthly plan</option>
              <option value="yearly">Yearly plan</option>
            </select>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" name="subscriptionStatus" checked={form.subscriptionStatus} onChange={handleChange} />
              Activate mock subscription on signup
            </label>
            <button className="button-primary" disabled={loading || charitiesLoading || charityUnavailable} type="submit">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already a member? <Link to="/login" className="text-brand-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
