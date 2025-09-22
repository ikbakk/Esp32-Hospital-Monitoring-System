import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABA5ZxXkbk8ea3uyZwu8VHAuBxThojGOY",

  authDomain: "ward-monitor.firebaseapp.com",

  projectId: "ward-monitor",

  storageBucket: "ward-monitor.firebasestorage.app",

  messagingSenderId: "520589135833",

  appId: "1:520589135833:web:b7286f06a84b283408d3c8",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
