"use client";

import { useState } from "react";
import { org, type FormType } from "@/config/organization";

const LABELS: Record<FormType, string> = {
  sponsor: "Sponsor",
  vendor: "Vendor",
  volunteer: "Volunteer",
  paparazzi: "Paparazzi / Media",
  performer: "Performer",
  contact: "General",
  "artist-fund": "Artist Fund",
};

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-primary/60";

export default function InquiryForm({
  defaultInterest,
  sourcePage,
}: {
  defaultInterest?: FormType;
  sourcePage?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      organization: fd.get("organization"),
      interest_type: fd.get("interest_type"),
      message: fd.get("message"),
      consent_to_contact: fd.get("consent") === "on",
      source_page: sourcePage ?? "unknown",
    };
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-card p-8 text-center">
        <h3 className="mb-2 font-heading text-xl text-white">Thank you</h3>
        <p className="text-sm text-white/70">
          Your information has been received. The {org.name} team will follow up soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name *" className={inputCls} />
        <input name="email" type="email" required placeholder="Email *" className={inputCls} />
        <input name="phone" placeholder="Phone" className={inputCls} />
        <input name="organization" placeholder="Organization" className={inputCls} />
      </div>

      <select name="interest_type" required defaultValue={defaultInterest ?? ""} className={inputCls}>
        <option value="" disabled>
          Interest type *
        </option>
        {org.forms.map((f) => (
          <option key={f} value={f} className="bg-black">
            {LABELS[f]}
          </option>
        ))}
      </select>

      <textarea name="message" rows={4} placeholder="Tell us a bit more…" className={inputCls} />

      <label className="flex items-start gap-2 text-xs text-white/60">
        <input type="checkbox" name="consent" className="mt-0.5 accent-[var(--ds-primary)]" />
        I consent to being contacted by {org.name} about my inquiry.
      </label>

      {status === "error" && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
