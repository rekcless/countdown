// firebase.js (MODULAR)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyDkBZ3ZXj4FH5ysvSBFhWOd7n-sQ6FCrF8",
  authDomain: "chat-b41eb.firebaseapp.com",
  projectId: "chat-b41eb",
  storageBucket: "chat-b41eb.firebasestorage.app",
  messagingSenderId: "128053308056",
  appId: "1:128053308056:web:cc8b4366f32bdb44bdbeed",
  measurementId: "G-LMSYZFNFE0"
};

// ===== INIT FIREBASE =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
