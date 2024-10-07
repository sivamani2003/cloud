// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_sj7vLWNNrzv5oxEYPkWV0tizamMuZ3c",
  authDomain: "base-bf56c.firebaseapp.com",
  projectId: "base-bf56c",
  storageBucket: "base-bf56c.appspot.com",
  messagingSenderId: "790253185931",
  appId: "1:790253185931:web:470944c9f1bca588871d8e",
  measurementId: "G-37DBPF9X12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
