import { Resend } from "resend";
import { org } from "@/config/organization";
import type { InquiryInput } from "@/lib/inquiry";

/**
 * Send the team notification + submitter confirmation via Resend.
 * No-ops gracefully (returns { sent: false }) if Resend env is unset, so the
 * form flow works locally before email is configured.
 */
export async function sendInquiryEmails(inq: InquiryInput): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || `${org.name} <${org.contactEmail}>`;
  const to = process.env.CONTACT_FORWARD_TO;

  if (!apiKey || !to) {
    console.warn("[email] Resend not configured — skipping email send.");
    return { sent: false };
  }

  const resend = new Resend(apiKey);

  // 1) Notification to the organization team
  await resend.emails.send({
    from,
    to,
    replyTo: inq.email,
    subject: `New ${org.name} Inquiry: ${inq.interest_type}`,
    text: [
      `Name: ${inq.name}`,
      `Email: ${inq.email}`,
      `Phone: ${inq.phone ?? "-"}`,
      `Organization: ${inq.organization ?? "-"}`,
      `Interest Type: ${inq.interest_type}`,
      `Source Page: ${inq.source_page ?? "-"}`,
      `Consent to contact: ${inq.consent_to_contact ? "yes" : "no"}`,
      ``,
      `Message:`,
      inq.message ?? "-",
    ].join("\n"),
  });

  // 2) Confirmation to the submitter
  await resend.emails.send({
    from,
    to: inq.email,
    subject: `Thanks for reaching out to ${org.name}`,
    text:
      `Hi ${inq.name},\n\n` +
      `Thank you for your interest in ${org.name}. Our team has received your ` +
      `"${inq.interest_type}" inquiry and will follow up soon.\n\n— ${org.name}`,
  });

  return { sent: true };
}
