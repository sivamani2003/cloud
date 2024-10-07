// src/Login.jsx
import React from "react";
import { auth, provider, signInWithPopup } from "./firebase";

const Login = ({ onLoginSuccess }) => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Store the email in localStorage
      localStorage.setItem("userEmail", user.email);
      console.log("User logged in:", user.email);
      // Call the onLoginSuccess prop to update the login state
      onLoginSuccess();
      // Optionally, redirect to the home page
      window.location.href = "/home"; // Redirect to home
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login with Google</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition duration-200"
          onClick={handleLogin}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
