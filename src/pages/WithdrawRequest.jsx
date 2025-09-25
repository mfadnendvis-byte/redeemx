// src/pages/WithdrawRequest.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrCreateWallet } from "../services/walletService";
import { submitWithdrawalRequest } from "../services/requestService";

export default function WithdrawRequest() {
  const { user } = useAuth();
  const [method, setMethod] = useState("PAYPAL");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    if (!user) return;
    let mounted = true;
    getOrCreateWallet(user.uid).then(w => { if(mounted) setWallet(w); });
    return ()=> (mounted = false);
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!wallet) { setMsg("Wallet not ready"); return; }
    const amt = parseFloat(amount || "0");
    if (amt <= 0) { setMsg("Enter valid amount"); return; }
    if (amt > wallet.balance) { setMsg("Insufficient balance"); return; }

    setLoading(true);
    try {
      await submitWithdrawalRequest({
        userId: user.uid,
        walletId: wallet.id,
        method,
        destination,
        amount: amt,
      });
      setMsg("Withdrawal request submitted. Admin will process.");
      setDestination(""); setAmount("");
    } catch (err) {
      setMsg("Error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
        <p className="mb-3">Available balance: <strong>{wallet ? wallet.balance.toFixed(2) : "0.00"} USD</strong></p>
        {msg && <div className="mb-3 text-sm">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={method} onChange={(e)=>setMethod(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="PAYPAL">PayPal</option>
            <option value="USDT">USDT</option>
          </select>
          <input required value={destination} onChange={(e)=>setDestination(e.target.value)} placeholder={method === "PAYPAL" ? "PayPal email" : "USDT address"} className="w-full border px-3 py-2 rounded" />
          <input required value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount (USD)" type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
          <button disabled={loading} className="w-full bg-yellow-500 text-white py-2 rounded">
            {loading ? "Submitting..." : "Submit Withdrawal"}
          </button>
        </form>
      </div>
    </div>
  );
}
