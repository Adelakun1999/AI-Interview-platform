"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleRegister = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register",
        {
          full_name: fullName,
          email: email,
          password: password
        }
      );

      console.log(response.data);

      setMessage("Registration successful");

      router.push("/login");

    } catch (error) {

      console.log(error);

      setMessage("Registration failed");
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Start your AI interview journey
        </p>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 mb-4 outline-none focus:border-blue-500"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 mb-4 outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 mb-6 outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white p-3 rounded-lg font-semibold"
        >
          Register
        </button>

        <p className="text-center text-zinc-300 mt-4">
          {message}
        </p>

      </div>

    </div>
  );
}