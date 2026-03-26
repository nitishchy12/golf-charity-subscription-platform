import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, Trophy, Wallet } from "lucide-react";

const highlights = [
  {
    title: "Track your last 5 scores",
    copy: "Every new score is validated, stored, and kept in reverse chronological order for quick review.",
    icon: Trophy
  },
  {
    title: "Monthly draw logic",
    copy: "Five numbers are generated each month and matched against your score history for prize allocation.",
    icon: Wallet
  },
  {
    title: "Built-in charity flow",
    copy: "Each member aligns their subscription with a cause and locks in a minimum contribution percentage.",
    icon: HeartHandshake
  }
];

const LandingPage = () => (
  <div className="relative isolate overflow-hidden">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-brand-300/30 bg-brand-300/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-brand-200">
            Golf Charity Subscription Platform
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Subscription golf meets monthly prizes and real charitable impact.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A production-ready platform for member onboarding, score management, charity selection, winner verification, and admin draw control.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/signup" className="button-primary gap-2">
              Start membership <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="button-secondary">
              Sign in
            </Link>
          </div>
        </div>

        <div className="glass-panel grid gap-4 p-5">
          {highlights.map(({ title, copy, icon: Icon }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-400/20 text-brand-300">
                <Icon size={18} />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default LandingPage;
