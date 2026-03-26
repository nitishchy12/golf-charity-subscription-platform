import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navStyles = ({ isActive }) =>
  `rounded-2xl px-4 py-2 text-sm transition ${isActive ? "bg-brand-400 text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`;

const Header = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-400 text-slate-950 shadow-glow">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <p className="text-sm text-brand-300">Golf Charity Platform</p>
            <p className="text-xs text-slate-400">Subscription gaming with impact</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/dashboard" className={navStyles}>
            Dashboard
          </NavLink>
          {isAdmin ? (
            <NavLink to="/admin" className={navStyles}>
              <span className="inline-flex items-center gap-2">
                <Shield size={16} /> Admin
              </span>
            </NavLink>
          ) : null}
          <button type="button" onClick={handleLogout} className="button-secondary gap-2">
            <LogOut size={16} /> {user?.name?.split(" ")[0] || "Logout"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
