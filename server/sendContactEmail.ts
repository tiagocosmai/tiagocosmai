/**
 * Envio via Resend — usar apenas no servidor (API key nunca no browser).
 */

export type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export type SendResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getConfig(): { apiKey: string; from: string; to: string } | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  const to = process.env.CONTACT_TO?.trim();
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to };
}

function buildEmailHtml(name: string, email: string, message: string): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <h2 style="color:#333;">New message from portfolio</h2>
  <p><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email / Phone:</strong> ${escapeHtml(email)}</p>
  <p><strong>Message:</strong></p>
  <div style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap;">${escapeHtml(message)}</div>
</body>
</html>`;
}

export async function sendContactViaResend(
  body: ContactPayload,
): Promise<SendResult> {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return {
      ok: false,
      status: 400,
      error: "Please fill in all fields.",
    };
  }

  if (message.length > 8000) {
    return {
      ok: false,
      status: 400,
      error: "Message is too long.",
    };
  }

  const config = getConfig();
  if (!config) {
    console.error("Missing RESEND_API_KEY, RESEND_FROM, or CONTACT_TO");
    return {
      ok: false,
      status: 503,
      error: "Contact form is not configured.",
    };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: email,
      subject: `Portfolio contact: ${name.slice(0, 60)}`,
      html: buildEmailHtml(name, email, message),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend API error:", res.status, text);
    return {
      ok: false,
      status: 502,
      error: "Could not send message. Please try again later.",
    };
  }

  return { ok: true };
}
