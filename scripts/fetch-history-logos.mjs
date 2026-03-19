#!/usr/bin/env node
/**
 * Baixa logos (Clearbit) para public/history-logos/.
 * Execute: node scripts/fetch-history-logos.mjs
 */
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "history-logos");

const domains = [
  ["futuresecure", "futuresecure.ai"],
  ["teros", "teros.com.br"],
  ["cvc", "cvc.com.br"],
  ["termomecanica", "termomecanica.com.br"],
  ["micropower", "micropower.com.br"],
];

await mkdir(outDir, { recursive: true });

for (const [slug, domain] of domains) {
  const url = `https://logo.clearbit.com/${domain}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio logo fetch)" },
    });
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) throw new Error("too small");
    await writeFile(join(outDir, `${slug}.png`), buf);
    console.log("OK", slug);
  } catch (e) {
    console.warn("Skip", slug, e.message);
  }
}
