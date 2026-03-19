import { useState } from "react";
import { Building2 } from "lucide-react";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

const SLUG_TO_DOMAIN: Record<string, string> = {
  futuresecure: "futuresecure.ai",
  teros: "teros.com.br",
  cvc: "cvc.com.br",
  micropower: "micropower.com.br",
  termomecanica: "termomecanica.com.br",
};

function ProjectLogo({
  logo,
  isDark,
}: {
  logo?: string;
  isDark: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const slug = logo?.match(/\/([^/]+)\.png(?:\?.*)?$/i)?.[1]?.toLowerCase();
  const domain = slug ? SLUG_TO_DOMAIN[slug] : undefined;
  const urls: string[] = [];
  if (logo?.trim()) urls.push(logo.trim());
  if (domain) {
    urls.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
    );
  }
  if (urls.length === 0 || idx >= urls.length) {
    return (
      <div
        className={`flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full ${
          isDark ? "bg-white/10 text-white/35" : "bg-[#166534]/15 text-[#14532d]/50"
        }`}
        aria-hidden
      >
        <Building2 className="h-7 w-7" strokeWidth={1.25} />
      </div>
    );
  }
  return (
    <div
      className={`shrink-0 rounded-full p-1 ${
        isDark ? "bg-white/10 ring-2 ring-white/15" : "bg-white ring-2 ring-[#166534]/25"
      }`}
    >
      <img
        src={urls[idx]}
        alt=""
        width={56}
        height={56}
        className="h-[56px] w-[56px] rounded-full object-contain"
        loading="lazy"
        decoding="async"
        onError={() => setIdx((i) => i + 1)}
      />
    </div>
  );
}

export default function Project() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { projects } = c;
  const isDark = mode === "dark";
  const text = isDark ? "text-white" : "text-[#0d1116]";
  const sectionTitle = sectionHeadingClass(isDark);
  const muted = isDark ? "text-white/75" : "text-[#14532d]/85";
  const cardBg = isDark
    ? "border-white/12 bg-white/[0.05]"
    : "border-[#166534]/20 bg-[#b8d9c4]/50 shadow-sm";
  const periodBadge = isDark
    ? "bg-white/10 text-white/90"
    : "bg-[#166534]/15 text-[#14532d]";

  return (
    <section
      className="scroll-mt-20 px-[5%] py-[5%] text-left md:px-[10%]"
      id="projects"
    >
      <h2
        className={`mb-10 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
      >
        <SectionTitleIcon
          name="projects"
          className={`h-9 w-9 shrink-0 md:h-10 md:w-10 ${sectionTitle}`}
        />
        {t("nav_projects")}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((p, i) => (
          <article
            key={`${p.title}-${i}`}
            className={`flex h-full flex-col rounded-xl border p-5 md:p-6 ${cardBg}`}
          >
            <div className="mb-4 flex gap-4 border-b border-black/10 pb-4 dark:border-white/10">
              <ProjectLogo logo={p.logo} isDark={isDark} />
              <div className="min-w-0 flex-1">
                <h3
                  className={`m-0 text-base font-bold leading-snug md:text-lg ${text}`}
                >
                  {p.title}
                </h3>
                <time
                  className={`mt-2 inline-block rounded-md px-2 py-1 text-xs font-semibold ${periodBadge}`}
                  dateTime={p.period}
                >
                  {p.period}
                </time>
              </div>
            </div>
            <p
              className={`m-0 flex-1 text-[0.875rem] leading-relaxed md:text-[0.95rem] ${muted}`}
            >
              {p.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
