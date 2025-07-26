// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBzXlMJjjFcqCCOY_C4Fs5DU3RDAKhKOA",
  authDomain: "faizyab-al-quran.firebaseapp.com",
  projectId: "faizyab-al-quran",
  storageBucket: "faizyab-al-quran.firebasestorage.app",
  messagingSenderId: "772007792970",
  appId: "1:772007792970:web:8cc29051b464d8684471b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
