"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PhotoUpload } from "@/src/components/PhotoUpload";

type Applicant = {
  id: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  dateOfVisaApplication: string;
  visaReferenceNumber: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  visaCategory: string;
  visaSubCategory: string;
  applicationType: string;
  visaGrantDate: string;
  travelDocumentCountry: string;
  stayFacility: string;
  visaStartDate: string;
  visaEndDate: string;
  visaDurationDays: number;
  mrzCode: string;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
const labelClass = "block text-xs font-medium text-slate-600";

export default function EditApplicantPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Applicant | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/applicants/${id}`);
        if (!res.ok) {
          setError("Applicant not found");
          setLoading(false);
          return;
        }
        const json = await res.json();
        const toDateInput = (value: string | Date) => {
          const d = new Date(value);
          return d.toISOString().slice(0, 10);
        };
        setData({
          ...json,
          photoUrl: json.photoUrl ?? "",
          dateOfVisaApplication: toDateInput(json.dateOfVisaApplication),
          dateOfBirth: toDateInput(json.dateOfBirth),
          visaGrantDate: toDateInput(json.visaGrantDate),
          visaStartDate: toDateInput(json.visaStartDate),
          visaEndDate: toDateInput(json.visaEndDate)
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load applicant");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          visaDurationDays: Number(data.visaDurationDays)
        })
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Failed to save changes");
        return;
      }
      router.push("/admin?tab=list");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">Loading applicant...</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-rose-600" role="alert">
          {error ?? "Applicant not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            href="/admin?tab=list"
            className="text-sm font-medium text-slate-600 hover:text-slate-800"
          >
            ← Back to visa list
          </Link>
          <a
            href="/api/admin/logout"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Logout
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800">
            Edit applicant – {data.firstName} {data.lastName}
          </h2>

          <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Photo</h3>
              <p className="mt-0.5 text-xs text-slate-500">Upload or change applicant&apos;s photo. You can adjust the crop before saving.</p>
            </div>
            <PhotoUpload
              value={data.photoUrl ?? ""}
              onChange={(url) =>
                setData((prev) => (prev ? { ...prev, photoUrl: url } : prev))
              }
            />
          </section>

          <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
            <h3 className="text-sm font-semibold text-slate-700">Applicant name</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>First name</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.firstName}
                  onChange={(e) =>
                    setData((prev) => (prev ? { ...prev, firstName: e.target.value } : prev))
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.lastName}
                  onChange={(e) =>
                    setData((prev) => (prev ? { ...prev, lastName: e.target.value } : prev))
                  }
                  required
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
            <h3 className="text-sm font-semibold text-slate-700">Application details</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Date of visa application</label>
                <input
                  type="date"
                  className={inputClass}
                  value={data.dateOfVisaApplication}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, dateOfVisaApplication: e.target.value } : prev
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Visa reference number</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.visaReferenceNumber}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, visaReferenceNumber: e.target.value } : prev
                    )
                  }
                  required
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
            <h3 className="text-sm font-semibold text-slate-700">Applicant details</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Date of birth</label>
                <input
                  type="date"
                  className={inputClass}
                  value={data.dateOfBirth}
                  onChange={(e) =>
                    setData((prev) => (prev ? { ...prev, dateOfBirth: e.target.value } : prev))
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Nationality</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.nationality}
                  onChange={(e) =>
                    setData((prev) => (prev ? { ...prev, nationality: e.target.value } : prev))
                  }
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Passport number</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.passportNumber}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, passportNumber: e.target.value } : prev
                    )
                  }
                  required
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
            <h3 className="text-sm font-semibold text-slate-700">Visa grant details</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Visa category</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.visaCategory}
                  onChange={(e) =>
                    setData((prev) => (prev ? { ...prev, visaCategory: e.target.value } : prev))
                  }
                  placeholder="Business"
                />
              </div>
              <div>
                <label className={labelClass}>Visa sub category</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.visaSubCategory}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, visaSubCategory: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Application type</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.applicationType}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, applicationType: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Visa grant date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={data.visaGrantDate}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, visaGrantDate: e.target.value } : prev
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Travel document country</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.travelDocumentCountry}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, travelDocumentCountry: e.target.value } : prev
                    )
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Stay facility</label>
                <input
                  type="text"
                  className={inputClass}
                  value={data.stayFacility}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, stayFacility: e.target.value } : prev
                    )
                  }
                  placeholder="MultipleEntry - Upto 1 Year"
                />
              </div>
              <div>
                <label className={labelClass}>Visa start date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={data.visaStartDate}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, visaStartDate: e.target.value } : prev
                    )
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Visa end date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={data.visaEndDate}
                  onChange={(e) =>
                    setData((prev) => (prev ? { ...prev, visaEndDate: e.target.value } : prev))
                  }
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Visa duration (days)</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={data.visaDurationDays}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, visaDurationDays: Number(e.target.value) } : prev
                    )
                  }
                />
              </div>
            </div>
          </section>

          {error && (
            <p
              className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/admin?tab=list"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
