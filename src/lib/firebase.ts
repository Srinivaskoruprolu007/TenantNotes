// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { firebaseConfig } from "./firebase-config";

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { app, auth, googleProvider, githubProvider };
