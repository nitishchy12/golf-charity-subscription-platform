const StatCard = ({ label, value, hint }) => (
  <div className="glass-panel p-5">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    {hint ? <p className="mt-2 text-xs text-brand-200">{hint}</p> : null}
  </div>
);

export default StatCard;
