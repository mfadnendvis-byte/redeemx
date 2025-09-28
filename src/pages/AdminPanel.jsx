// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchPendingRedeemRequests,
  fetchPendingWithdrawals,
  approveRedeemRequest,
  rejectRedeemRequest,
  approveWithdrawalRequest,
  rejectWithdrawalRequest,
} from "../services/requestService";

export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [redeems, setRedeems] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function loadRequests() {
    setLoading(true);
    try {
      const [r, w] = await Promise.all([
        fetchPendingRedeemRequests(),
        fetchPendingWithdrawals(),
      ]);
      setRedeems(r);
      setWithdraws(w);
    } catch (err) {
      console.error("Error loading admin requests:", err);
    } finally {
      setLoading(false);
    }
  }

  function setLoadingFor(id, value) {
    setActionLoading((s) => ({ ...s, [id]: value }));
  }

  async function handleApproveRedeem(id, declaredValue) {
    if (!window.confirm("Approve this redeem and credit user's wallet?")) return;
    const input = window.prompt(
      "Enter credited value (or leave empty to use declared):",
      String(declaredValue ?? "")
    );
    const adminValue =
      input === null || input === "" ? null : parseFloat(input);
    setLoadingFor(id, true);
    try {
      await approveRedeemRequest(id, user.uid, adminValue);
      await loadRequests();
    } catch (err) {
      alert("Approve failed: " + (err.message || err));
      console.error(err);
    } finally {
      setLoadingFor(id, false);
    }
  }

  async function handleRejectRedeem(id) {
    const note = window.prompt(
      "Rejection note (optional):",
      "Invalid/Unredeemable"
    );
    if (!window.confirm("Are you sure you want to reject this redeem?")) return;
    setLoadingFor(id, true);
    try {
      await rejectRedeemRequest(id, user.uid, note || "Rejected by admin");
      await loadRequests();
    } catch (err) {
      alert("Reject failed: " + (err.message || err));
      console.error(err);
    } finally {
      setLoadingFor(id, false);
    }
  }

  async function handleApproveWithdraw(id) {
    if (
      !window.confirm(
        "Mark this withdrawal as PAID? (You should execute payout off-platform first)"
      )
    )
      return;
    setLoadingFor(id, true);
    try {
      await approveWithdrawalRequest(id, user.uid);
      await loadRequests();
    } catch (err) {
      alert("Approve failed: " + (err.message || err));
      console.error(err);
    } finally {
      setLoadingFor(id, false);
    }
  }

  async function handleRejectWithdraw(id) {
    const note = window.prompt("Rejection note (optional):", "Cannot payout");
    if (!window.confirm("Reject and refund this withdrawal?")) return;
    setLoadingFor(id, true);
    try {
      await rejectWithdrawalRequest(id, user.uid, note || "Rejected by admin");
      await loadRequests();
    } catch (err) {
      alert("Reject failed: " + (err.message || err));
      console.error(err);
    } finally {
      setLoadingFor(id, false);
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Please log in to view Admin Panel.
          </h2>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">🚫 Access Denied</h2>
          <p className="mt-2">You are not an admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-blue-600">Admin Panel</h1>

      {loading && <p className="text-gray-600">Loading requests...</p>}

      {/* Redeem Requests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🎁 Redeem Requests</h2>
        {redeems.length === 0 ? (
          <p className="text-gray-500">No pending redeem requests.</p>
        ) : (
          <ul className="space-y-3">
            {redeems.map((r) => (
              <li
                key={r.id}
                className="bg-white p-4 rounded shadow border space-y-1"
              >
                <div className="font-medium text-lg">
                  {r.userName || r.userEmail || r.userId}
                </div>
                <div className="text-sm text-gray-600">
                  {r.provider} — {r.country}
                </div>
                <div className="text-sm">Code: {r.code || "—"}</div>
                <div className="text-sm">PIN: {r.pin || "—"}</div>
                {r.whatsapp && (
                 <div className="text-sm">
                   WhatsApp: <span className="font-medium">{r.whatsapp}</span>
                    </div>
                 )}

                <div className="text-sm">
                  Declared Value:{" "}
                  <span className="font-semibold">
                    ${Number(r.declaredValue || 0).toFixed(2)}
                  </span>
                </div>
                {r.adminValue !== null && (
                  <div className="text-sm">
                    Credited:{" "}
                    <span className="font-semibold">
                      ${Number(r.adminValue).toFixed(2)}
                    </span>
                  </div>
                )}
                {r.adminNote && (
                  <div className="text-sm text-gray-700">
                    Admin Note: {r.adminNote}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    disabled={actionLoading[r.id]}
                    onClick={() =>
                      handleApproveRedeem(r.id, r.declaredValue)
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-60"
                  >
                    {actionLoading[r.id] ? "..." : "Approve"}
                  </button>
                  <button
                    disabled={actionLoading[r.id]}
                    onClick={() => handleRejectRedeem(r.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-60"
                  >
                    {actionLoading[r.id] ? "..." : "Reject"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Withdrawal Requests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">💵 Withdrawal Requests</h2>
        {withdraws.length === 0 ? (
          <p className="text-gray-500">No pending withdrawal requests.</p>
        ) : (
          <ul className="space-y-3">
            {withdraws.map((w) => (
              <li
                key={w.id}
                className="bg-white p-4 rounded shadow border space-y-1"
              >
                <div className="font-medium text-lg">
                  {w.userName || w.userEmail || w.userId}
                </div>
                <div className="text-sm text-gray-600">
                  {w.method} → {w.destination}
                </div>
                <div className="text-sm">
                  Amount:{" "}
                  <span className="font-semibold">
                    ${Number(w.amount || 0).toFixed(2)}
                  </span>
                </div>
                {w.adminNote && (
                  <div className="text-sm text-gray-700">
                    Admin Note: {w.adminNote}
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    disabled={actionLoading[w.id]}
                    onClick={() => handleApproveWithdraw(w.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-60"
                  >
                    {actionLoading[w.id] ? "..." : "Approve (PAID)"}
                  </button>
                  <button
                    disabled={actionLoading[w.id]}
                    onClick={() => handleRejectWithdraw(w.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-60"
                  >
                    {actionLoading[w.id] ? "..." : "Reject & Refund"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
