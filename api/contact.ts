import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendContactViaResend } from "../server/sendContactEmail";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await sendContactViaResend(req.body);
  if (result.ok) {
    return res.status(200).json({ ok: true });
  }
  return res.status(result.status).json({ error: result.error });
}
