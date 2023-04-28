// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArRRW_3_k9EiUuL-bNyD20B1_g-8dLqN0",
  authDomain: "house-marketplace-app-d1b0d.firebaseapp.com",
  projectId: "house-marketplace-app-d1b0d",
  storageBucket: "house-marketplace-app-d1b0d.appspot.com",
  messagingSenderId: "359520011647",
  appId: "1:359520011647:web:24e65f8085e7e8cc8dc64a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);