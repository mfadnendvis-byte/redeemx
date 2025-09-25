// src/services/walletService.js
import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Wallet structure
 * Collection: wallets
 * DocId: userId
 * Data: { userId, balance (number, USD), currency, createdAt }
 */

// ensure wallet exists and return it
export async function getOrCreateWallet(userId) {
  const walletRef = doc(db, "wallets", userId);
  const snap = await getDoc(walletRef);
  if (snap.exists()) return { id: walletRef.id, ...snap.data() };

  const newData = { userId, balance: 0, currency: "USD", createdAt: serverTimestamp() };
  await setDoc(walletRef, newData);
  return { id: walletRef.id, ...newData };
}

export async function getWalletBalance(userId) {
  const wallet = await getOrCreateWallet(userId);
  // ensure balance is a number
  return typeof wallet.balance === "number" ? wallet.balance : 0;
}

// credit wallet (amount in USD, positive number)
export async function addToWallet(userId, amount) {
  if (!userId) throw new Error("userId required");
  if (amount === 0) return;

  const walletRef = doc(db, "wallets", userId);
  await runTransaction(db, async (t) => {
    const wsnap = await t.get(walletRef);
    if (!wsnap.exists()) {
      t.set(walletRef, { userId, balance: amount, currency: "USD", createdAt: serverTimestamp() });
    } else {
      const prev = wsnap.data().balance || 0;
      t.update(walletRef, { balance: prev + amount });
    }
    // optional: log transaction
    const txRef = doc(collection(db, "transactions"));
    t.set(txRef, {
      walletId: walletRef.id,
      type: "CREDIT",
      amount,
      description: "Admin credit",
      createdAt: serverTimestamp(),
    });
  });
}

// deduct wallet (amount in USD, positive number) - throws if insufficient
export async function deductFromWallet(userId, amount) {
  if (!userId) throw new Error("userId required");
  if (amount === 0) return;

  const walletRef = doc(db, "wallets", userId);
  await runTransaction(db, async (t) => {
    const wsnap = await t.get(walletRef);
    if (!wsnap.exists()) throw new Error("Wallet not found");
    const prev = wsnap.data().balance || 0;
    if (prev < amount) throw new Error("Insufficient balance");
    t.update(walletRef, { balance: prev - amount });

    const txRef = doc(collection(db, "transactions"));
    t.set(txRef, {
      walletId: walletRef.id,
      type: "DEBIT",
      amount,
      description: "Withdrawal hold/debit",
      createdAt: serverTimestamp(),
    });
  });
}
