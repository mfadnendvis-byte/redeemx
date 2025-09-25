// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getWalletBalance, getOrCreateWallet } from "../services/walletService";
import { getRequests } from "../services/requestService";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (user) {
      getWalletBalance(user.uid).then(b => setBalance(b)).catch(()=>setBalance(0));
      getRequests(user.uid).then(setRequests).catch(()=>setRequests([]));
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Hello, {user?.email}</h1>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Wallet Balance</h2>
        <p className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Link to="/redeem" className="block p-6 bg-white border rounded-xl shadow hover:shadow-lg text-center">
          <h3 className="text-lg font-semibold mb-2">🎁 Redeem Gift Card</h3>
          <p className="text-gray-600">Submit your card to add balance.</p>
        </Link>

        <Link to="/withdraw" className="block p-6 bg-white border rounded-xl shadow hover:shadow-lg text-center">
          <h3 className="text-lg font-semibold mb-2">💵 Withdraw Funds</h3>
          <p className="text-gray-600">Request payout to PayPal or USDT.</p>
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-600">No requests yet.</p>
        ) : (
          <ul className="divide-y">
            {requests.slice(0, 5).map((req) => (
              <li key={req.id} className="py-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">{req.type === "redeem" ? "🎁 Redeem" : "💵 Withdraw"}</span>{" "}
                  — <span className="capitalize">{(req.status || "pending").toLowerCase()}</span>
                  <div className="text-sm text-gray-500">{req.provider ? req.provider : req.destination}</div>
                </div>
                <span className="font-semibold">${(req.declaredValue ?? req.amount ?? 0).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
