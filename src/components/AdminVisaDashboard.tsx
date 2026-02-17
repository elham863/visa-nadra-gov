"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { NewApplicantForm } from "./NewApplicantForm";
import VisaDocument from "./VisaDocument";
import type { VisaApplicantLike } from "./VisaGrantNotice";
import type { VisaDocumentHandle } from "./VisaDocument";
import { getQrBaseUrl } from "@/src/lib/env";

type Applicant = VisaApplicantLike & { id: string };

export function AdminVisaDashboard({
  applicants: initialApplicants
}: {
  applicants: Applicant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") ?? "list";
  const previewParam = searchParams.get("preview") ?? null;
  const createdParam = searchParams.get("created") ?? null;

  const [tab, setTab] = useState<"new" | "list">(
    tabParam === "new" ? "new" : "list"
  );
  const [previewId, setPreviewId] = useState<string | null>(previewParam);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [regeneratingQrId, setRegeneratingQrId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const visaDocRef = useRef<VisaDocumentHandle>(null);

  useEffect(() => {
    setTab(tabParam === "new" ? "new" : "list");
    setPreviewId(previewParam);
  }, [tabParam, previewParam]);

  useEffect(() => {
    setApplicants(initialApplicants);
  }, [initialApplicants]);

  function switchTab(t: "new" | "list") {
    setTab(t);
    const params = new URLSearchParams();
    params.set("tab", t);
    router.push(`/admin?${params.toString()}`, { scroll: false });
  }

  function openPreview(id: string) {
    setPreviewId(id);
    const params = new URLSearchParams();
    params.set("tab", "list");
    params.set("preview", id);
    router.push(`/admin?${params.toString()}`, { scroll: false });
  }

  function closePreview() {
    setPreviewId(null);
    const params = new URLSearchParams();
    params.set("tab", "list");
    router.push(`/admin?${params.toString()}`, { scroll: false });
  }

  function onCreated(createdId: string) {
    setTab("list");
    setPreviewId(createdId);
    router.push(`/admin?tab=list&created=${createdId}`, { scroll: false });
    router.refresh();
  }

  async function regenerateQr(applicantId: string) {
    setRegeneratingQrId(applicantId);
    try {
      const res = await fetch(`/api/applicants/${applicantId}/regenerate-qr`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Regenerate failed");
      const updated = await res.json();
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicantId ? updated : a))
      );
    } finally {
      setRegeneratingQrId(null);
    }
  }

  async function deleteApplicant(applicantId: string, name: string) {
    if (
      !window.confirm(
        `Delete applicant "${name}"? This cannot be undone.`
      )
    ) {
      return;
    }
    setDeletingId(applicantId);
    try {
      const res = await fetch(`/api/applicants/${applicantId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Delete failed");
      setApplicants((prev) => prev.filter((a) => a.id !== applicantId));
      if (previewId === applicantId) {
        closePreview();
      }
    } finally {
      setDeletingId(null);
    }
  }

  const previewApplicant = previewId
    ? applicants.find((a) => a.id === previewId)
    : null;

  return (
    <div className="admin-visa-dashboard min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-800">Visa management</h1>
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/logout"
              className="text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              Logout
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 print:hidden">
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => switchTab("new")}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${tab === "new"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
          >
            New visa
          </button>
          <button
            type="button"
            onClick={() => switchTab("list")}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${tab === "list"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
          >
            Visa lists
          </button>
        </div>

        {tab === "new" && (
          <div className="mt-4">
            <NewApplicantForm onSuccess={onCreated} />
          </div>
        )}

        {tab === "list" && (
          <div className="mt-4">
            {createdParam && (
              <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                Applicant created. You can open the preview below or download the PDF.
              </p>
            )}

            {applicants.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No applicants yet. Click &quot;New visa&quot; to add one.
              </div>
            ) : (
              <ul className="space-y-3">
                {applicants.map((applicant) => (
                  <li key={applicant.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openPreview(applicant.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openPreview(applicant.id);
                        }
                      }}
                      className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800">
                            {applicant.firstName} {applicant.lastName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Visa ref: <span className="font-mono">{applicant.visaReferenceNumber}</span>
                            {" · "}
                            Passport: <span className="font-mono">{applicant.passportNumber}</span>
                            {" · "}
                            {applicant.visaCategory} · {applicant.nationality}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-xs text-slate-400">QR</span>
                          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={applicant.qrCodeDataUrl}
                              alt="QR code"
                              className="h-14 w-14"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              regenerateQr(applicant.id);
                            }}
                            disabled={regeneratingQrId === applicant.id}
                            className="shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                            title="Regenerate QR code (new style)"
                          >
                            {regeneratingQrId === applicant.id ? "…" : "Regenerate QR"}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const a = document.createElement("a");
                              a.href = applicant.qrCodeDataUrl;
                              a.download = `qr-${applicant.visaReferenceNumber || applicant.id}.png`;
                              a.click();
                            }}
                            className="shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            title="Download QR code"
                          >
                            Download QR
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteApplicant(
                                applicant.id,
                                `${applicant.firstName} ${applicant.lastName}`
                              );
                            }}
                            disabled={deletingId === applicant.id}
                            className="shrink-0 rounded-lg border border-rose-300 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                            title="Delete applicant"
                          >
                            {deletingId === applicant.id ? "…" : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      {/* Preview modal */}
      {previewApplicant && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 print:hidden"
            aria-hidden
            onClick={closePreview}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print-modal-outer">
            <div
              className="relative max-h-[95vh] w-full max-w-4xl overflow-auto rounded-2xl border border-slate-200 bg-white shadow-2xl print-modal-inner"
              role="dialog"
              aria-modal="true"
            >
              <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white p-4 print:hidden">
                <h2 id="preview-title" className="text-lg font-semibold text-slate-800">
                  Visa preview – {previewApplicant.firstName} {previewApplicant.lastName}
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/edit/${previewApplicant.id}`}
                    className="inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setDownloadingPdf(true);
                      try {
                        await visaDocRef.current?.downloadPDF();
                      } finally {
                        setDownloadingPdf(false);
                      }
                    }}
                    disabled={downloadingPdf}
                    className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadingPdf ? "Preparing PDF…" : "Download PDF"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={() => regenerateQr(previewApplicant.id)}
                    disabled={regeneratingQrId === previewApplicant.id}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    title="Regenerate QR code (new style)"
                  >
                    {regeneratingQrId === previewApplicant.id ? "Regenerating…" : "Regenerate QR"}
                  </button>
                  <a
                    href={`${getQrBaseUrl()}/e-visa/verify/${previewApplicant.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Open public page
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      deleteApplicant(
                        previewApplicant.id,
                        `${previewApplicant.firstName} ${previewApplicant.lastName}`
                      )
                    }
                    disabled={deletingId === previewApplicant.id}
                    className="inline-flex items-center rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                    title="Delete this applicant"
                  >
                    {deletingId === previewApplicant.id ? "Deleting…" : "Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={closePreview}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex justify-center bg-slate-200 p-6 print:bg-white print:p-0 print:block overflow-auto print:overflow-visible print-visa-wrapper">
                <VisaDocument ref={visaDocRef} applicant={previewApplicant} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
