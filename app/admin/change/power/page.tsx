"use client";

import { useEffect, useState } from "react";

export default function AdminPowerPage() {
  const [powerOn, setPowerOn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [controlKey, setControlKey] = useState("");

  const loadState = async () => {
    setError(null);
    try {
      const res = await fetch("/api/power/status", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load power state.");
      }
      setPowerOn(data.powerOn !== false);
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
      const trimmed = controlKey.trim();
      if (!trimmed) {
        setError("Enter your control key.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/power/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ powerOn: !powerOn, secret: trimmed })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.error ||
            (res.status === 401
              ? "Wrong control key or server is not configured (POWER_TOGGLE_SECRET)."
              : "Failed to update power state.")
        );
      }
      setPowerOn(data.powerOn !== false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update state.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Control</h1>
        <p className="mt-3 text-slate-400 text-sm">
          When OFF, the public site shows a single message. When ON, everything
          works as usual.
        </p>

        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950 p-4">
          <div className="text-sm text-slate-400">Status</div>
          <div className="mt-1 text-xl font-semibold">
            {powerOn === null ? "Loading..." : powerOn ? "ON" : "OFF"}
          </div>
        </div>

        <label className="mt-6 block text-sm text-slate-400">
          Control key
          <input
            type="password"
            autoComplete="off"
            value={controlKey}
            onChange={(e) => setControlKey(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white outline-none focus:border-slate-500"
            placeholder="Required — matches POWER_TOGGLE_SECRET on the server"
          />
        </label>

        <button
          type="button"
          onClick={togglePower}
          disabled={loading || powerOn === null}
          className="mt-6 inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-slate-950 disabled:opacity-60"
        >
          {loading
            ? "Updating..."
            : powerOn
              ? "Turn OFF"
              : "Turn ON"}
        </button>

        {error ? <p className="mt-4 text-rose-400">{error}</p> : null}
      </div>
    </main>
  );
}
