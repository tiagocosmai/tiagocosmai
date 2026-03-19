#!/usr/bin/env node
/**
 * Deploy para GitHub Pages:
 * 1. Gera o build estático (GH_PAGES=true → base /tiagocosmai/)
 * 2. Confirma que dist/index.html é o build do Vite (não o index de dev com main.tsx)
 * 3. Publica com gh-pages
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

const REPO_URL = "https://github.com/tiagocosmai/tiagocosmai.git";

async function main() {
  console.log("\n[deploy] 1/3 — npm run build:gh (Vite → dist/)\n");
  execSync("npm run build:gh", { stdio: "inherit", cwd: root, env: process.env });

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

  console.log("\n[deploy] 2/3 — dist/ validado (HTML de produção)\n");

  const ghpages = require("gh-pages");
  const publish = promisify(ghpages.publish);
  console.log("[deploy] 3/3 — gh-pages publish → branch gh-pages\n");

  await publish(path.join(root, "dist"), {
    repo: REPO_URL,
    branch: "gh-pages",
    nojekyll: true,
    message: `Deploy ${new Date().toISOString()}`,
  });

  console.log("\n[deploy] Publicado. No GitHub: Settings → Pages → Branch: gh-pages\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
