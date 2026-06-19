import { org } from "@/config/organization";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { InquiryInput } from "@/lib/inquiry";

export type EventType = "inquiry";

export interface EmitResult {
  persisted: boolean;
  id?: string;
  /** true when Supabase isn't configured yet (local/dev) — not persisted. */
  devMode?: boolean;
}

/**
 * The event seam. Phase 1 writes operational records (e.g. `inquiries`).
 * Phase 2 additionally appends an immutable Passport event when the
 * org.buckets.passport flag is enabled — without changing any caller.
 */
export async function emitEvent(type: EventType, payload: InquiryInput): Promise<EmitResult> {
  const supabase = getSupabaseAdmin();

  if (type === "inquiry") {
    if (!supabase) {
      console.warn("[emitEvent] Supabase not configured — dev mode; inquiry not persisted:", payload);
      return { persisted: false, devMode: true };
    }

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        organization: payload.organization ?? org.name,
        interest_type: payload.interest_type,
        message: payload.message,
        source_page: payload.source_page,
        consent_to_contact: payload.consent_to_contact,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    // Phase 2 seam — append to the immutable Passport event log.
    if (org.buckets.enabled && org.buckets.passport) {
      await supabase.from("passport_entries").insert({
        event_type: "inquiry",
        payload: payload as unknown as Record<string, unknown>,
      });
    }

    return { persisted: true, id: data?.id as string | undefined };
  }

  return { persisted: false };
}
