// src/pages/RedeemRequest.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { submitRedeemRequest } from "../services/requestService";

export default function RedeemRequest() {
  const { user } = useAuth();
  const [country, setCountry] = useState("");
  const [provider, setProvider] = useState("");
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await submitRedeemRequest({
        userId: user.uid,
        country,
        provider,
        code,
        pin,
        declaredValue: parseFloat(declaredValue) || 0,
      });
      setMsg("Redeem request submitted to our partner, we will update within 30-45 minutes.");
      setCountry(""); setProvider(""); setCode(""); setPin(""); setDeclaredValue("");
    } catch (error) {
      setMsg("Error: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Submit Redeem Request</h2>
        {msg && <div className="mb-3 text-sm">{msg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select required value={country} onChange={(e)=>setCountry(e.target.value)} className="w-full border px-3 py-2 rounded">
            <option value="">Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
          </select>

          <input required value={provider} onChange={(e)=>setProvider(e.target.value)} placeholder="Provider (e.g. Amazon US)" className="w-full border px-3 py-2 rounded" />
          <input required value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Gift card code" className="w-full border px-3 py-2 rounded" />
          <input value={pin} onChange={(e)=>setPin(e.target.value)} placeholder="PIN (if any)" className="w-full border px-3 py-2 rounded" />
          <input required value={declaredValue} onChange={(e)=>setDeclaredValue(e.target.value)} placeholder="Declared value (USD)" type="number" step="0.01" className="w-full border px-3 py-2 rounded" />

          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? "Submitting..." : "Submit Redeem"}
          </button>
        </form>
      </div>
    </div>
  );
}
