import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import RedeemRequest from "./pages/RedeemRequest";
import WithdrawRequest from "./pages/WithdrawRequest";
import AdminPanel from "./pages/AdminPanel";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, isAdmin } = useAuth(); // ✅ include isAdmin

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ User-only routes */}
        {user && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/redeem" element={<RedeemRequest />} />
            <Route path="/withdraw" element={<WithdrawRequest />} />
          </>
        )}

        {/* ✅ Admin-only route */}
        {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
      </Routes>
    </Layout>
  );
}
