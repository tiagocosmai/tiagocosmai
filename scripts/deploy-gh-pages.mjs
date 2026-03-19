#!/usr/bin/env node
/**
 * Deploy para GitHub Pages na RAIZ (https://tiagocosmai.github.io):
 * 1. npm run build (Vite com base "/")
 * 2. Valida dist/index.html (produção, não main.tsx)
 * 3. Publica na branch gh-pages do repositório tiagocosmai.github.io
 *
 * Requer repositório GitHub: tiagocosmai/tiagocosmai.github.io
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** User/org site = URL na raiz do domínio github.io */
const PAGES_REPO_URL = "https://github.com/tiagocosmai/tiagocosmai.github.io.git";

async function main() {
  console.log("\n[deploy] 1/3 — npm run build (Vite → dist/, base /)\n");
  execSync("npm run build", { stdio: "inherit", cwd: root, env: process.env });

  const indexPath = path.join(root, "dist", "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("\n[deploy] ERRO: dist/index.html não existe. O build falhou.\n");
    process.exit(1);
  }

  const html = fs.readFileSync(indexPath, "utf8");
  if (html.includes("main.tsx") || html.includes("/src/main")) {
    console.error(
      "\n[deploy] ERRO: dist/index.html ainda aponta para main.tsx (build inválido).\n",
    );
    process.exit(1);
  }
  if (!html.includes("assets/")) {
    console.error(
      "\n[deploy] ERRO: dist/index.html não contém referência a assets/ (build inválido).\n",
    );
    process.exit(1);
  }
  if (html.includes("/tiagocosmai/")) {
    console.error(
      "\n[deploy] ERRO: HTML ainda referencia /tiagocosmai/ — o base do Vite deve ser \"/\".\n",
    );
    process.exit(1);
  }

  console.log("\n[deploy] 2/3 — dist/ validado (HTML de produção, raiz)\n");

  const ghpages = require("gh-pages");
  const publish = promisify(ghpages.publish);
  console.log(
    `[deploy] 3/3 — gh-pages publish → ${PAGES_REPO_URL} (branch gh-pages)\n`,
  );

  await publish(path.join(root, "dist"), {
    repo: PAGES_REPO_URL,
    branch: "gh-pages",
    nojekyll: true,
    message: `Deploy ${new Date().toISOString()}`,
  });

  console.log(
    "\n[deploy] Publicado. URL: https://tiagocosmai.github.io\n" +
      "No repositório tiagocosmai.github.io: Settings → Pages → Branch: gh-pages\n",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
