"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Paw from "@/components/Paw";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password — no treats for you 🐶");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <form
        onSubmit={submit}
        className="rounded-3xl border-4 border-amber-900/10 bg-white p-8 text-center shadow-lg"
      >
        <Paw className="mx-auto text-amber-600" size={44} />
        <h1 className="mt-3 text-2xl font-black text-amber-950">Pack leader login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="mt-6 w-full rounded-xl border-2 border-amber-900/20 px-4 py-3 font-bold outline-none focus:border-amber-500"
        />
        {error && <p className="mt-3 text-sm font-bold text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-amber-600 py-3 font-black text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Sniffing…" : "Let me in 🐾"}
        </button>
      </form>
    </div>
  );
}
