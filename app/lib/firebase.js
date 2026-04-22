import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkTw3eBOlx2iE8dr1HK663AP6AIaHvQe0",
  authDomain: "fir-demo-69c51.firebaseapp.com",
  projectId: "fir-demo-69c51",
  storageBucket: "fir-demo-69c51.firebasestorage.app",
  messagingSenderId: "836400121157",
  appId: "1:836400121157:web:3e7ec793001e0b7ed6ea2c",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
