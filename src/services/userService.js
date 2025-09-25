// src/services/userService.js
import { db } from "./firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function addNewUserProfile(userId, profileData = {}) {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    ...profileData,
    isAdmin: profileData.isAdmin || false,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserProfile(userId) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}
