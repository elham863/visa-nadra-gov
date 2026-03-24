"use client";

import { useEffect, useState } from "react";

export default function AdminPowerPage() {
  const [powerOn, setPowerOn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadState = async () => {
    setError(null);
    try {
      const res = await fetch("/api/power/status", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load power state.");
      }
      setPowerOn(Boolean(data.powerOn));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load state.");
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  const togglePower = async () => {
    if (typeof powerOn !== "boolean") return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/power/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ powerOn: !powerOn })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update power state.");
      }
      setPowerOn(Boolean(data.powerOn));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update state.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">System Power Control</h1>
        <p className="mt-3 text-slate-300">
          Secret route: <code>/admin/change/power</code>
        </p>
        <p className="mt-1 text-slate-300">
          When OFF, all public pages show: <strong>Elham Paisa Ra Bettttti</strong>
        </p>

        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950 p-4">
          <div className="text-sm text-slate-400">Current status</div>
          <div className="mt-1 text-xl font-semibold">
            {powerOn === null ? "Loading..." : powerOn ? "ON" : "OFF"}
          </div>
        </div>

        <button
          type="button"
          onClick={togglePower}
          disabled={loading || powerOn === null}
          className="mt-6 inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-slate-950 disabled:opacity-60"
        >
          {loading
            ? "Updating..."
            : powerOn
              ? "Turn OFF everything"
              : "Turn ON everything"}
        </button>

        {error ? <p className="mt-4 text-rose-400">{error}</p> : null}
      </div>
    </main>
  );
}
