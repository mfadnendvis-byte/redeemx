// src/services/requestService.js
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { getUserProfile } from "./userService";
import { addToWallet, deductFromWallet } from "./walletService";

/* -------------------------
   User actions
   ------------------------- */

/**
 * submitRedeemRequest(payload)
 * payload: { userId, userEmail, country, provider, code, pin, declaredValue }
 */
export async function submitRedeemRequest(payload) {
  const col = collection(db, "redeemRequests");
  const payloadDoc = {
    userId: payload.userId,
    userEmail: payload.userEmail || null,
    country: payload.country || null,
    provider: payload.provider || null,
    code: payload.code || null,
    pin: payload.pin || null,
    declaredValue: Number(payload.declaredValue || 0),
    adminValue: null,
    status: "PENDING",
    adminId: null,
    adminNote: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(col, payloadDoc);
  return ref.id;
}

/**
 * submitWithdrawalRequest(payload)
 * payload: { userId, userEmail, walletId, method, destination, amount }
 */
export async function submitWithdrawalRequest(payload) {
  const col = collection(db, "withdrawRequests");
  const payloadDoc = {
    userId: payload.userId,
    userEmail: payload.userEmail || null,
    walletId: payload.walletId || payload.userId,
    method: payload.method || "PAYPAL",
    destination: payload.destination || null,
    amount: Number(payload.amount || 0),
    fee: 0,
    status: "PENDING",
    adminId: null,
    adminNote: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(col, payloadDoc);

  try {
    await deductFromWallet(payload.userId, payloadDoc.amount);
    return ref.id;
  } catch (err) {
    await updateDoc(ref, {
      status: "REJECTED",
      adminNote: "Auto-rejected: insufficient funds",
      updatedAt: serverTimestamp(),
    });
    throw err;
  }
}

/* -------------------------
   User fetch
   ------------------------- */

/**
 * getRequests(userId) - fetch user's redeem + withdrawal requests
 */
export async function getRequests(userId) {
  const redeemQ = query(collection(db, "redeemRequests"), where("userId", "==", userId));
  const withdrawQ = query(collection(db, "withdrawRequests"), where("userId", "==", userId));

  const [redeemSnap, withdrawSnap] = await Promise.all([getDocs(redeemQ), getDocs(withdrawQ)]);

  const redeems = redeemSnap.docs.map((d) => ({ id: d.id, type: "redeem", ...d.data() }));
  const withdraws = withdrawSnap.docs.map((d) => ({ id: d.id, type: "withdraw", ...d.data() }));

  const all = [...redeems, ...withdraws];
  all.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return all;
}

/* -------------------------
   Admin fetch
   ------------------------- */

export async function fetchPendingRedeemRequests() {
  try {
    const q = query(collection(db, "redeemRequests"), where("status", "==", "PENDING"));
    const snap = await getDocs(q);
    const results = [];
    for (const d of snap.docs) {
      const data = d.data();
      if (!data.userEmail && data.userId) {
        const profile = await getUserProfile(data.userId).catch(() => null);
        results.push({ id: d.id, ...data, userEmail: profile?.email ?? null });
      } else {
        results.push({ id: d.id, ...data });
      }
    }
    return results;
  } catch (err) {
    console.error("fetchPendingRedeemRequests error:", err);
    return [];
  }
}

export async function fetchPendingWithdrawals() {
  try {
    const q = query(collection(db, "withdrawRequests"), where("status", "==", "PENDING"));
    const snap = await getDocs(q);
    const results = [];
    for (const d of snap.docs) {
      const data = d.data();
      if (!data.userEmail && data.userId) {
        const profile = await getUserProfile(data.userId).catch(() => null);
        results.push({ id: d.id, ...data, userEmail: profile?.email ?? null });
      } else {
        results.push({ id: d.id, ...data });
      }
    }
    return results;
  } catch (err) {
    console.error("fetchPendingWithdrawals error:", err);
    return [];
  }
}

/* -------------------------
   Admin actions
   ------------------------- */

export async function approveRedeemRequest(requestId, adminId = "admin", adminValue = null) {
  const ref = doc(db, "redeemRequests", requestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Redeem request not found");
  const r = snap.data();
  if (r.status !== "PENDING") throw new Error("Redeem is not pending");

  const credit = adminValue !== null ? Number(adminValue) : Number(r.declaredValue || 0);
  await addToWallet(r.userId, credit);

  await updateDoc(ref, {
    status: "APPROVED",
    adminValue: credit,
    adminId,
    adminNote: "Approved",
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "transactions"), {
    type: "REDEEM_APPROVED",
    requestId,
    userId: r.userId,
    provider: r.provider,
    country: r.country,
    code: r.code,
    pin: r.pin,
    amount: credit,
    adminId,
    createdAt: serverTimestamp(),
  });
}

export async function rejectRedeemRequest(requestId, adminId = "admin", note = "Rejected by admin") {
  const ref = doc(db, "redeemRequests", requestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Redeem request not found");
  const r = snap.data();
  if (r.status !== "PENDING") throw new Error("Redeem is not pending");

  await updateDoc(ref, {
    status: "REJECTED",
    adminId,
    adminNote: note,
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "transactions"), {
    type: "REDEEM_REJECTED",
    requestId,
    userId: r.userId,
    provider: r.provider,
    country: r.country,
    code: r.code,
    pin: r.pin,
    adminId,
    createdAt: serverTimestamp(),
  });
}

export async function approveWithdrawalRequest(requestId, adminId = "admin") {
  const ref = doc(db, "withdrawRequests", requestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Withdrawal not found");
  const w = snap.data();
  if (w.status !== "PENDING") throw new Error("Withdrawal not pending");

  await updateDoc(ref, {
    status: "PAID",
    adminId,
    adminNote: "Payout marked as PAID",
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "transactions"), {
    type: "WITHDRAW_PAID",
    requestId,
    userId: w.userId,
    method: w.method,
    destination: w.destination,
    amount: w.amount,
    adminId,
    createdAt: serverTimestamp(),
  });
}

export async function rejectWithdrawalRequest(requestId, adminId = "admin", note = "Rejected by admin") {
  const ref = doc(db, "withdrawRequests", requestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Withdrawal not found");
  const w = snap.data();
  if (w.status !== "PENDING") throw new Error("Withdrawal not pending");

  await addToWallet(w.userId, Number(w.amount || 0));

  await updateDoc(ref, {
    status: "REJECTED",
    adminId,
    adminNote: note,
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, "transactions"), {
    type: "WITHDRAW_REJECTED",
    requestId,
    userId: w.userId,
    method: w.method,
    destination: w.destination,
    amount: w.amount,
    adminId,
    createdAt: serverTimestamp(),
  });
}
