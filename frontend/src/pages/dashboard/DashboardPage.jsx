import { useEffect, useMemo, useState } from "react";
import { Target } from "lucide-react";
import { charityApi, drawApi, userApi } from "../../api/endpoints";
import SectionCard from "../../components/shared/SectionCard";
import StatCard from "../../components/shared/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatCurrency, formatDate, getSubscriptionLabel } from "../../lib/formatters";

const DashboardPage = () => {
  const { user, refreshProfile } = useAuth();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [charities, setCharities] = useState([]);
  const [winners, setWinners] = useState([]);
  const [draws, setDraws] = useState([]);
  const [scoreValue, setScoreValue] = useState("");
  const [subscriptionForm, setSubscriptionForm] = useState({
    subscriptionStatus: user?.subscriptionStatus || false,
    subscriptionType: user?.subscriptionType || "monthly"
  });
  const [charityForm, setCharityForm] = useState({
    charityId: user?.charityId?._id || user?.charityId || "",
    charityPercentage: user?.charityPercentage || 10
  });

  const loadData = async () => {
    const [profileResponse, charitiesResponse, drawsResponse, winnersResponse] = await Promise.all([
      userApi.me(),
      charityApi.list(),
      drawApi.list(),
      drawApi.winners()
    ]);
    setProfile(profileResponse.data.data);
    setCharities(charitiesResponse.data.data);
    setDraws(drawsResponse.data.data);
    setWinners(winnersResponse.data.data.filter((winner) => winner.userId._id === profileResponse.data.data.user._id));
    setSubscriptionForm({
      subscriptionStatus: profileResponse.data.data.user.subscriptionStatus,
      subscriptionType: profileResponse.data.data.user.subscriptionType || "monthly"
    });
    setCharityForm({
      charityId: profileResponse.data.data.user.charityId?._id || "",
      charityPercentage: profileResponse.data.data.user.charityPercentage || 10
    });
  };

  useEffect(() => {
    loadData().catch(() => {
      pushToast({ message: "Failed to load dashboard", variant: "error" });
    });
  }, []);

  const stats = useMemo(() => {
    const totalWinnings = winners.reduce((sum, winner) => sum + winner.amount, 0);
    return [
      { label: "Subscription", value: getSubscriptionLabel(profile?.user), hint: "mock billing state" },
      { label: "Tracked scores", value: profile?.scores?.length || 0, hint: "latest five only" },
      { label: "Your wins", value: winners.length, hint: formatCurrency(totalWinnings) },
      { label: "Charity giveback", value: `${profile?.user?.charityPercentage || 10}%`, hint: profile?.user?.charityId?.name || "No charity selected" }
    ];
  }, [profile, winners]);

  const handleAddScore = async (event) => {
    event.preventDefault();
    try {
      await userApi.addScore({ value: Number(scoreValue) });
      setScoreValue("");
      await loadData();
      pushToast({ message: "Score added." });
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Could not add score", variant: "error" });
    }
  };

  const handleSubscriptionSave = async (event) => {
    event.preventDefault();
    try {
      await userApi.updateSubscription(subscriptionForm);
      await refreshProfile();
      await loadData();
      pushToast({ message: "Subscription updated." });
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Subscription update failed", variant: "error" });
    }
  };

  const handleCharitySave = async (event) => {
    event.preventDefault();
    try {
      await userApi.updateCharity({
        charityId: charityForm.charityId,
        charityPercentage: Number(charityForm.charityPercentage)
      });
      await refreshProfile();
      await loadData();
      pushToast({ message: "Charity selection updated." });
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Charity update failed", variant: "error" });
    }
  };

  const handleProofUpload = async (winnerId, file) => {
    const formData = new FormData();
    formData.append("proof", file);
    try {
      await userApi.uploadProof(winnerId, formData);
      await loadData();
      pushToast({ message: "Proof uploaded." });
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Proof upload failed", variant: "error" });
    }
  };

  if (!profile) {
    return <div className="flex min-h-[50vh] items-center justify-center text-slate-300">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="glass-panel overflow-hidden p-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Member overview</p>
            <h1 className="mt-4 text-4xl font-semibold text-white">Welcome back, {profile.user.name}.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Your dashboard brings together membership status, draw participation, recent scores, charity impact, and prize verification in one place.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Recent scores" subtitle="Only the last five scores are stored. New entries replace the oldest automatically.">
          <form className="mb-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleAddScore}>
            <input className="input" type="number" min="1" max="45" placeholder="Enter score from 1 to 45" value={scoreValue} onChange={(event) => setScoreValue(event.target.value)} required />
            <button className="button-primary sm:w-40" type="submit">Add score</button>
          </form>
          <div className="grid gap-3">
            {profile.scores.length ? (
              profile.scores.map((score) => (
                <div key={score._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-400/15 text-brand-300">
                      <Target size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-white">Score {score.value}</p>
                      <p className="text-xs text-slate-400">{formatDate(score.date)}</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Tracked</span>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">No scores added yet.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Membership settings" subtitle="Update your mock subscription or charity contribution preferences.">
          <form className="grid gap-4" onSubmit={handleSubscriptionSave}>
            <select className="input" value={subscriptionForm.subscriptionType} onChange={(event) => setSubscriptionForm((current) => ({ ...current, subscriptionType: event.target.value }))}>
              <option value="monthly">Monthly plan</option>
              <option value="yearly">Yearly plan</option>
            </select>
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <input type="checkbox" checked={subscriptionForm.subscriptionStatus} onChange={(event) => setSubscriptionForm((current) => ({ ...current, subscriptionStatus: event.target.checked }))} />
              Keep subscription active
            </label>
            <button className="button-secondary" type="submit">Save subscription</button>
          </form>

          <form className="mt-6 grid gap-4" onSubmit={handleCharitySave}>
            <select className="input" value={charityForm.charityId} onChange={(event) => setCharityForm((current) => ({ ...current, charityId: event.target.value }))}>
              <option value="">Select charity</option>
              {charities.map((charity) => (
                <option key={charity._id} value={charity._id}>{charity.name}</option>
              ))}
            </select>
            <input className="input" type="number" min="10" max="100" value={charityForm.charityPercentage} onChange={(event) => setCharityForm((current) => ({ ...current, charityPercentage: event.target.value }))} />
            <button className="button-secondary" type="submit">Save charity settings</button>
          </form>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Draw participation" subtitle="Latest monthly draws and the numbers generated by admin.">
          <div className="grid gap-3">
            {draws.length ? (
              draws.map((draw) => (
                <div key={draw._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">{draw.monthKey}</p>
                      <p className="text-lg font-semibold text-white">Prize pool {formatCurrency(draw.prizePool)}</p>
                    </div>
                    <div className="flex gap-2">
                      {draw.drawNumbers.map((number) => (
                        <span key={`${draw._id}-${number}`} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-400/20 text-sm font-semibold text-brand-200">
                          {number}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">No draws have been run yet.</p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Winnings and proof" subtitle="Upload winner proof for admin verification and payout tracking.">
          <div className="grid gap-3">
            {winners.length ? (
              winners.map((winner) => (
                <div key={winner._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-white">{winner.matchType} number match</p>
                      <p className="text-sm text-slate-400">{winner.drawId?.monthKey} draw • {formatCurrency(winner.amount)} • {winner.status}</p>
                    </div>
                    <label className="button-secondary cursor-pointer">
                      Upload proof
                      <input type="file" className="hidden" onChange={(event) => event.target.files?.[0] && handleProofUpload(winner._id, event.target.files[0])} />
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-400">No winnings yet. Keep your score history sharp for the next draw.</p>
            )}
          </div>
        </SectionCard>
      </section>
    </div>
  );
};

export default DashboardPage;
