import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBakj4wt7cDZlQoZnsjmwEXI4p21IOxqvg",
  authDomain: "smart-home-finance-313f3.firebaseapp.com",
  projectId: "smart-home-finance-313f3",
  storageBucket: "smart-home-finance-313f3.firebasestorage.app",
  messagingSenderId: "836152215914",
  appId: "1:836152215914:web:7ddc57cfef99b903213d13",
  measurementId: "G-E821FLWD5E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);