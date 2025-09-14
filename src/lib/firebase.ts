// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgBHPETXpnaZnNryHakqlxv7cfGdOq3qs",
  authDomain: "encoded-net-463504-a2.firebaseapp.com",
  projectId: "encoded-net-463504-a2",
  storageBucket: "encoded-net-463504-a2.firebasestorage.app",
  messagingSenderId: "86065515836",
  appId: "1:86065515836:web:141d66a64cb78844416239",
  measurementId: "G-RDMJKRBPDZ"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { app, auth, googleProvider, githubProvider };
