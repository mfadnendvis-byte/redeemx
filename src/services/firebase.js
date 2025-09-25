// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIhNIDY7NELOv_bar4AEeeEzo1Sb-2QqQ",
  authDomain: "redeemx-dae41.firebaseapp.com",
  projectId: "redeemx-dae41",
  storageBucket: "redeemx-dae41.firebasestorage.app",
  messagingSenderId: "485634896960",
  appId: "1:485634896960:web:a071d8f168b604720d5ba5",
  measurementId: "G-4WC8LWT929"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
