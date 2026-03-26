import { useEffect, useState } from "react";
import { adminApi, charityApi, drawApi } from "../../api/endpoints";
import SectionCard from "../../components/shared/SectionCard";
import { useToast } from "../../context/ToastContext";
import { formatCurrency } from "../../lib/formatters";

const emptyCharity = { name: "", description: "", image: "" };

const AdminPage = () => {
  const { pushToast } = useToast();
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [winners, setWinners] = useState([]);
  const [draws, setDraws] = useState([]);
  const [charityForm, setCharityForm] = useState(emptyCharity);
  const [drawForm, setDrawForm] = useState({ monthKey: "", prizePool: 10000 });
  const [editingCharityId, setEditingCharityId] = useState("");
  const [drawRunning, setDrawRunning] = useState(false);

  const loadData = async () => {
    const [usersResponse, charitiesResponse, winnersResponse, drawsResponse] = await Promise.all([
      adminApi.users(),
      charityApi.list(),
      drawApi.winners(),
      drawApi.list()
    ]);
    setUsers(usersResponse.data.data);
    setCharities(charitiesResponse.data.data);
    setWinners(winnersResponse.data.data);
    setDraws(drawsResponse.data.data);
  };

  useEffect(() => {
    loadData().catch(() => pushToast({ message: "Admin data failed to load", variant: "error" }));
  }, []);

  const saveCharity = async (event) => {
    event.preventDefault();
    try {
      if (editingCharityId) {
        await charityApi.update(editingCharityId, charityForm);
        pushToast({ message: "Charity updated." });
      } else {
        await charityApi.create(charityForm);
        pushToast({ message: "Charity created." });
      }
      setCharityForm(emptyCharity);
      setEditingCharityId("");
      await loadData();
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Could not save charity", variant: "error" });
    }
  };

  const handleRunDraw = async () => {
    const now = new Date();
    const fallbackMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    try {
      setDrawRunning(true);
      await drawApi.create({
        monthKey: drawForm.monthKey || fallbackMonthKey,
        prizePool: Number(drawForm.prizePool)
      });
      await loadData();
      pushToast({ message: "Draw generated successfully!" });
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Error generating draw", variant: "error" });
    } finally {
      setDrawRunning(false);
    }
  };

  const runDraw = async (event) => {
    event.preventDefault();
    await handleRunDraw();
  };

  const updateWinnerStatus = async (winnerId, status) => {
    try {
      await adminApi.updateWinnerStatus(winnerId, { status });
      await loadData();
      pushToast({ message: `Winner marked ${status}.` });
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Could not update winner", variant: "error" });
    }
  };

  const updateSubscription = async (userId, subscriptionStatus) => {
    try {
      await adminApi.updateSubscription(userId, {
        subscriptionStatus: !subscriptionStatus,
        subscriptionType: "monthly"
      });
      await loadData();
      pushToast({ message: "User subscription updated." });
    } catch (error) {
      pushToast({ message: error.response?.data?.message || "Could not update user", variant: "error" });
    }
  };

  const startEditingCharity = (charity) => {
    setEditingCharityId(charity._id);
    setCharityForm({ name: charity.name, description: charity.description, image: charity.image || "" });
  };

  return (
    <div className="space-y-8">
      <section className="glass-panel p-8">
        <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Admin control</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Run monthly draws, manage winners, and oversee subscriptions.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">This panel covers the operational workflows that matter most in the PRD: member oversight, charity management, draw execution, and payout tracking.</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard title={editingCharityId ? "Edit charity" : "Add charity"} subtitle="Create or update charities available during signup and profile updates.">
          <form className="grid gap-4" onSubmit={saveCharity}>
            <input className="input" placeholder="Charity name" value={charityForm.name} onChange={(event) => setCharityForm((current) => ({ ...current, name: event.target.value }))} required />
            <textarea className="input min-h-28" placeholder="Description" value={charityForm.description} onChange={(event) => setCharityForm((current) => ({ ...current, description: event.target.value }))} required />
            <input className="input" placeholder="Image URL" value={charityForm.image} onChange={(event) => setCharityForm((current) => ({ ...current, image: event.target.value }))} />
            <div className="flex gap-3">
              <button className="button-primary flex-1" type="submit">{editingCharityId ? "Update charity" : "Create charity"}</button>
              {editingCharityId ? (
                <button className="button-secondary" type="button" onClick={() => { setEditingCharityId(""); setCharityForm(emptyCharity); }}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
          <div className="mt-5 grid gap-3">
            {charities.map((charity) => (
              <div key={charity._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{charity.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{charity.description}</p>
                  </div>
                  <button className="button-secondary" type="button" onClick={() => startEditingCharity(charity)}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Run draw" subtitle="Generate five random numbers between 1 and 45 and split the prize pool across winners.">
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={runDraw}>
            <input className="input" placeholder="YYYY-MM" value={drawForm.monthKey} onChange={(event) => setDrawForm((current) => ({ ...current, monthKey: event.target.value }))} />
            <input className="input" type="number" min="100" placeholder="Prize pool" value={drawForm.prizePool} onChange={(event) => setDrawForm((current) => ({ ...current, prizePool: event.target.value }))} />
            <button className="button-primary" type="submit" disabled={drawRunning}>{drawRunning ? "Running..." : "Generate draw"}</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleRunDraw}
              disabled={drawRunning}
              className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
            >
              {drawRunning ? "Running Draw..." : "Run Draw"}
            </button>
            <p className="text-sm text-slate-400">Use this one-click action to trigger the monthly draw and winner calculation instantly.</p>
          </div>
          <div className="mt-5 grid gap-3">
            {draws.map((draw) => (
              <div key={draw._id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{draw.monthKey}</p>
                    <p className="text-sm text-slate-400">Pool {formatCurrency(draw.prizePool)}</p>
                  </div>
                  <div className="flex gap-2">
                    {draw.drawNumbers.map((number) => (
                      <span key={`${draw._id}-${number}`} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-400/20 text-brand-100">{number}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="Users" subtitle="Review user roles, selected charity, and mock subscription status.">
          <div className="grid gap-3">
            {users.map((user) => (
              <div key={user._id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email} • {user.role}</p>
                  <p className="text-xs text-brand-200">{user.charityId?.name || "No charity"} • {user.subscriptionStatus ? user.subscriptionType : "inactive"}</p>
                </div>
                <button className="button-secondary" type="button" onClick={() => updateSubscription(user._id, user.subscriptionStatus)}>
                  {user.subscriptionStatus ? "Deactivate" : "Activate"} subscription
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Winner management" subtitle="Approve proof, reject claims, and mark payouts as paid.">
          <div className="grid gap-3">
            {winners.map((winner) => (
              <div key={winner._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium text-white">{winner.userId?.name} • {winner.matchType} match</p>
                <p className="mt-1 text-sm text-slate-400">{winner.drawId?.monthKey} • {formatCurrency(winner.amount)} • {winner.status}</p>
                {winner.proof ? (
                  <a className="mt-2 inline-block text-sm text-brand-300" href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${winner.proof}`} target="_blank" rel="noreferrer">
                    View proof
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">No proof uploaded yet.</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="button-secondary" type="button" onClick={() => updateWinnerStatus(winner._id, "approved")}>Approve</button>
                  <button className="button-secondary" type="button" onClick={() => updateWinnerStatus(winner._id, "rejected")}>Reject</button>
                  <button className="button-primary" type="button" onClick={() => updateWinnerStatus(winner._id, "paid")}>Mark paid</button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
};

export default AdminPage;
