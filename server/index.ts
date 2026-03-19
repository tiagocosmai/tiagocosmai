import "dotenv/config";
import cors from "cors";
import express from "express";
import { sendContactViaResend } from "./sendContactEmail";

const app = express();
const port = Number(process.env.CONTACT_API_PORT) || 8787;

app.use(
  cors({
    origin: true,
    methods: ["POST", "OPTIONS"],
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: "48kb" }));

app.post("/api/contact", async (req, res) => {
  const result = await sendContactViaResend(req.body);
  if (result.ok) {
    res.json({ ok: true });
    return;
  }
  res.status(result.status).json({ error: result.error });
});

app.listen(port, () => {
  console.log(`[contact-api] http://localhost:${port}/api/contact`);
});
