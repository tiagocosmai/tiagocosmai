import { useEffect, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

const CACHE_KEY = "portfolio-gh-stats";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function parseRepo(githubUrl: string): string | null {
  const m = githubUrl.match(/github\.com\/([^/]+\/[^/]+?)(?:\/|$)/i);
  return m ? m[1] : null;
}

type GhStats = {
  stars: number;
  language: string | null;
  updated_at: string;
} | null;

function useGitHubStats(githubUrl: string): GhStats {
  const [stats, setStats] = useState<GhStats>(null);
  const repo = parseRepo(githubUrl);
  useEffect(() => {
    if (!repo) return;
    try {
      const cached = sessionStorage.getItem(`${CACHE_KEY}:${repo}`);
      if (cached) {
        const { data, at } = JSON.parse(cached) as { data: GhStats; at: number };
        if (Date.now() - at < CACHE_TTL_MS && data) {
          setStats(data);
          return;
        }
      }
    } catch {
      /* ignore */
    }
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled || !j) return;
        const data: GhStats = {
          stars: j.stargazers_count ?? 0,
          language: j.language ?? null,
          updated_at: j.updated_at ?? "",
        };
        try {
          sessionStorage.setItem(
            `${CACHE_KEY}:${repo}`,
            JSON.stringify({ data, at: Date.now() })
          );
        } catch {
          /* ignore */
        }
        setStats(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [githubUrl, repo]);
  return stats;
}

function formatRelative(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffDays / 365);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}

function GitHubStatsBadge({
  githubUrl,
  starsLabel,
  updatedLabel,
}: {
  githubUrl: string;
  starsLabel: string;
  updatedLabel: string;
}) {
  const stats = useGitHubStats(githubUrl);
  if (!stats) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
      {stats.stars >= 0 && (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-1 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
          ★ {stats.stars} {starsLabel}
        </span>
      )}
      {stats.language && (
        <span className="rounded-md bg-slate-500/15 px-2 py-1 text-slate-700 dark:bg-slate-400/20 dark:text-slate-300">
          {stats.language}
        </span>
      )}
      {stats.updated_at && (
        <span className="text-white/60 dark:text-white/50">
          {updatedLabel} {formatRelative(stats.updated_at)}
        </span>
      )}
    </div>
  );
}

export default function PersonalProjects() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { personal_projects } = c;
  const isDark = mode === "dark";
  const text = isDark ? "text-white" : "text-[#0d1116]";
  const sectionTitle = sectionHeadingClass(isDark);
  const muted = isDark ? "text-white/75" : "text-[#14532d]/85";
  const cardBg = isDark
    ? "border-white/12 bg-white/[0.05]"
    : "border-[#166534]/20 bg-[#b8d9c4]/50 shadow-sm";
  const linkClass = isDark
    ? "text-emerald-400 hover:text-emerald-300"
    : "text-[#166534] hover:text-[#14532d]";
  const statusBadge = isDark
    ? "bg-white/10 text-white/90"
    : "bg-[#166534]/15 text-[#14532d]";

  return (
    <section
      className="scroll-mt-20 px-[5%] py-[5%] text-left md:px-[10%]"
      id="personal-projects"
    >
      <h2
        className={`mb-10 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
      >
        <SectionTitleIcon
          name="personal_projects"
          className={`h-9 w-9 shrink-0 md:h-10 md:w-10 ${sectionTitle}`}
        />
        {t("nav_personal_projects")}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {personal_projects.items.map((p, i) => {
          const href = p.live_url?.trim() && p.live_url !== "-"
            ? p.live_url
            : p.github_url;
          return (
            <article
              key={`${p.title}-${i}`}
              className={`flex h-full flex-col rounded-xl border p-5 md:p-6 ${cardBg}`}
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2 border-b border-black/10 pb-3 dark:border-white/10">
                <h3 className="m-0 min-w-0 flex-1 text-base font-bold leading-snug md:text-lg">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${text} hover:underline ${linkClass}`}
                  >
                    {p.title}
                  </a>
                </h3>
                {p.status?.trim() && (
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${statusBadge}`}
                  >
                    {p.status}
                  </span>
                )}
              </div>
              <p
                className={`m-0 flex-1 text-[0.875rem] leading-relaxed md:text-[0.95rem] ${muted}`}
              >
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={p.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${linkClass}`}
                  aria-label={t("aria_github")}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                {p.live_url?.trim() && p.live_url !== "-" && (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${linkClass}`}
                    aria-label={t("personal_projects_view_site")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("personal_projects_view_site")}
                  </a>
                )}
              </div>
              <GitHubStatsBadge
                githubUrl={p.github_url}
                starsLabel={t("personal_projects_stars")}
                updatedLabel={t("personal_projects_updated")}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
