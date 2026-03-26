import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Header from "./components/layout/Header";
import ToastViewport from "./components/shared/ToastViewport";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AdminPage from "./pages/admin/AdminPage";

const AppShell = ({ children }) => (
  <>
    <Header />
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
  </>
);

const App = () => (
  <>
    <ToastViewport />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
        />
      </Route>
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route
          path="/admin"
          element={
            <AppShell>
              <AdminPage />
            </AppShell>
          }
        />
      </Route>
    </Routes>
  </>
);

export default App;
