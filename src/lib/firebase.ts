import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAahjBicYHKkd5Kw5Z-qiKS-ertLyUnptM",
  authDomain: "mess-feedback-system-d94a5.firebaseapp.com",
  projectId: "mess-feedback-system-d94a5",
  storageBucket: "mess-feedback-system-d94a5.firebasestorage.app",
  messagingSenderId: "321737070976",
  appId: "1:321737070976:web:132a016aaeb1ed68ea8965",
  measurementId: "G-VMG4GCE8B4"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// RENAMED: Snacks -> Night Canteen
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Night Canteen'] as const;
export type MealType = typeof MEAL_TYPES[number];

export const getMealID = (date: string, type: string) => `${date}_${type.toLowerCase().replace(" ", "_")}`;