"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authClient.signUp.email({ email, name, password });
      if (res?.error) {
        const err = res.error;
        setError(err.message || err.statusText || `Error ${err.status ?? ""}`);
        setLoading(false);
        return;
      }
      // Full page load so the server immediately sees the new session.
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#8a4b52] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-7 flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-gray-800">📝 Bober To-Do</h1>
        <p className="text-sm text-gray-500 -mt-2">Create your account</p>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 outline-none focus:border-indigo-500"
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-indigo-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
