import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkTw3eBOlx2iE8dr1HK663AP6AIaHvQe0",
  authDomain: "fir-demo-69c51.firebaseapp.com",
  projectId: "fir-demo-69c51",
  storageBucket: "fir-demo-69c51.firebasestorage.app",
  messagingSenderId: "836400121157",
  appId: "1:836400121157:web:3e7ec793001e0b7ed6ea2c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
