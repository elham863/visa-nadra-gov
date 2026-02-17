"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "./PhotoUpload";

type FormState = {
  photoUrl: string;
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
  visaDurationDays: string;
};

const defaultForm: FormState = {
  photoUrl: "",
  firstName: "",
  lastName: "",
  dateOfVisaApplication: "",
  visaReferenceNumber: "",
  dateOfBirth: "",
  nationality: "",
  passportNumber: "",
  visaCategory: "Business",
  visaSubCategory: "Individual",
  applicationType: "Entry",
  visaGrantDate: "",
  travelDocumentCountry: "Afghanistan",
  stayFacility: "MultipleEntry - Upto 1 Year",
  visaStartDate: "",
  visaEndDate: "",
  visaDurationDays: ""
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
const labelClass = "block text-xs font-medium text-slate-600";

export function NewApplicantForm({
  onSuccess
}: {
  onSuccess: (createdId: string) => void;
}) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          visaDurationDays: Number(form.visaDurationDays || "0")
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to create applicant");
        return;
      }

      const created = await res.json();
      onSuccess(created.id);
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-800">New visa application</h3>

      <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
        <div>
          <h4 className="text-sm font-semibold text-slate-700">Photo</h4>
          <p className="mt-0.5 text-xs text-slate-500">Upload applicant&apos;s photo. You can adjust the crop before saving.</p>
        </div>
        <PhotoUpload
          value={form.photoUrl}
          onChange={(url) => handleChange("photoUrl", url)}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
        <h4 className="text-sm font-semibold text-slate-700">Applicant name</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>First name</label>
            <input
              type="text"
              className={inputClass}
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Last name</label>
            <input
              type="text"
              className={inputClass}
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
        <h4 className="text-sm font-semibold text-slate-700">Application details</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Date of visa application</label>
            <input
              type="date"
              className={inputClass}
              value={form.dateOfVisaApplication}
              onChange={(e) => handleChange("dateOfVisaApplication", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Visa reference number</label>
            <input
              type="text"
              className={inputClass}
              value={form.visaReferenceNumber}
              onChange={(e) => handleChange("visaReferenceNumber", e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
        <h4 className="text-sm font-semibold text-slate-700">Applicant details</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Date of birth</label>
            <input
              type="date"
              className={inputClass}
              value={form.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Nationality</label>
            <input
              type="text"
              className={inputClass}
              value={form.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Passport number</label>
            <input
              type="text"
              className={inputClass}
              value={form.passportNumber}
              onChange={(e) => handleChange("passportNumber", e.target.value)}
              required
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1fr,2fr]">
        <h4 className="text-sm font-semibold text-slate-700">Visa grant details</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Visa category</label>
            <input
              type="text"
              className={inputClass}
              value={form.visaCategory}
              onChange={(e) => handleChange("visaCategory", e.target.value)}
              placeholder="Business"
            />
          </div>
          <div>
            <label className={labelClass}>Visa sub category</label>
            <input
              type="text"
              className={inputClass}
              value={form.visaSubCategory}
              onChange={(e) => handleChange("visaSubCategory", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Application type</label>
            <input
              type="text"
              className={inputClass}
              value={form.applicationType}
              onChange={(e) => handleChange("applicationType", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Visa grant date</label>
            <input
              type="date"
              className={inputClass}
              value={form.visaGrantDate}
              onChange={(e) => handleChange("visaGrantDate", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Travel document country</label>
            <input
              type="text"
              className={inputClass}
              value={form.travelDocumentCountry}
              onChange={(e) => handleChange("travelDocumentCountry", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Stay facility</label>
            <input
              type="text"
              className={inputClass}
              value={form.stayFacility}
              onChange={(e) => handleChange("stayFacility", e.target.value)}
              placeholder="MultipleEntry - Upto 1 Year"
            />
          </div>
          <div>
            <label className={labelClass}>Visa start date</label>
            <input
              type="date"
              className={inputClass}
              value={form.visaStartDate}
              onChange={(e) => handleChange("visaStartDate", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Visa end date</label>
            <input
              type="date"
              className={inputClass}
              value={form.visaEndDate}
              onChange={(e) => handleChange("visaEndDate", e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Visa duration (days)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.visaDurationDays}
              onChange={(e) => handleChange("visaDurationDays", e.target.value)}
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create & generate QR"}
        </button>
      </div>
    </form>
  );
}
