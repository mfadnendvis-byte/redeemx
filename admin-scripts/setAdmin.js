// admin-scripts/setAdmin.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const auth = getAuth();

// ⚠️ Replace this with the UID of the user you want to make admin
const UID = "ekBdYAYGHTeN6lPNoy0vbm6d9Cg1";

async function setAdmin() {
  try {
    // Option 1: Save admin flag inside Firestore user document
    await db.collection("users").doc(UID).set(
      {
        isAdmin: true,
      },
      { merge: true }
    );

    // Option 2: (optional) set custom claim so you can also use it in rules
    await auth.setCustomUserClaims(UID, { admin: true });

    console.log(`✅ User ${UID} set as admin successfully.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error setting admin:", err);
    process.exit(1);
  }
}

setAdmin();
