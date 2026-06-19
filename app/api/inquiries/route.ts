import { NextResponse } from "next/server";
import { validateInquiry } from "@/lib/inquiry";
import { emitEvent } from "@/lib/emitEvent";
import { sendInquiryEmails } from "@/lib/email";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validateInquiry(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const emit = await emitEvent("inquiry", result.value);

    // Email is best-effort: a delivery failure should not fail the submission.
    let emailed = { sent: false };
    try {
      emailed = await sendInquiryEmails(result.value);
    } catch (e) {
      console.error("[inquiries] email send failed:", e);
    }

    return NextResponse.json({
      ok: true,
      persisted: emit.persisted,
      devMode: emit.devMode ?? false,
      emailed: emailed.sent,
    });
  } catch (e) {
    console.error("[inquiries] submission failed:", e);
    return NextResponse.json(
      { error: "Submission failed. Please try again." },
      { status: 500 },
    );
  }
}
