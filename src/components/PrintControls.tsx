"use client";

import { useState } from "react";

export function PrintControls({ applicantId }: { applicantId: string }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  async function handleDownload() {
    try {
      setError(null);
      setDownloading(true);

      const res = await fetch(`/api/applicants/${applicantId}/pdf`);
      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visa-${applicantId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("Could not download PDF");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mb-4 flex flex-col items-end gap-2 text-xs print:hidden">
      {error && <p className="text-rose-400">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500"
        >
          Print
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? "Preparing PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
}

