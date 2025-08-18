import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGfOKWGbTYsIe_dAWvk9dGrfhBwU2kkxQ",
  authDomain: "householdservices-51b2b.firebaseapp.com",
  projectId: "householdservices-51b2b",
  storageBucket: "householdservices-51b2b.firebasestorage.app",
  messagingSenderId: "886850681113",
  appId: "1:886850681113:web:4d865cbe4f2e6b7df46d88",
  measurementId: "G-5BL9EW4N9Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);