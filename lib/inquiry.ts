export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  interest_type: string;
  message?: string;
  source_page?: string;
  consent_to_contact?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ValidationResult =
  | { ok: true; value: InquiryInput }
  | { ok: false; error: string };

/** Validate + normalize a raw request body into an InquiryInput. */
export function validateInquiry(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request body" };
  const b = body as Record<string, unknown>;

  const name = String(b.name ?? "").trim();
  const email = String(b.email ?? "").trim();
  const interest_type = String(b.interest_type ?? "").trim();

  if (!name) return { ok: false, error: "Name is required" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "A valid email is required" };
  if (!interest_type) return { ok: false, error: "Interest type is required" };

  const str = (v: unknown) => (v ? String(v).trim() : undefined);

  return {
    ok: true,
    value: {
      name,
      email,
      phone: str(b.phone),
      organization: str(b.organization),
      interest_type,
      message: str(b.message),
      source_page: str(b.source_page),
      consent_to_contact: Boolean(b.consent_to_contact),
    },
  };
}
