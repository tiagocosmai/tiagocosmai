import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import appConfig from "../data/config.json";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

/** Competências na timeline se pelo menos um modo de CV tiver showSkills: true */
const SHOW_HISTORY_SKILLS = Object.values(
  (appConfig as { resume?: { modes?: Record<string, { showSkills?: boolean }> } })
    .resume?.modes ?? {},
).some((m) => m.showSkills !== false);

const LOGO_LOCAL: Record<string, string> = {
  "futuresecure.ai": "futuresecure",
  "teros.com.br": "teros",
  "cvc.com.br": "cvc",
  "termomecanica.com.br": "termomecanica",
  "micropower.com.br": "micropower",
};

function TimelineLogo({ domain }: { domain?: string }) {
  const [stage, setStage] = useState(0);
  const slug = domain ? LOGO_LOCAL[domain] : undefined;
  const urls = domain
    ? [
        ...(slug
          ? [
              `/history-logos/${slug}.png`,
              `/project-logos/${slug}.png`,
            ]
          : []),
        `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
      ]
    : [];

  /* Fallback quando o logo remoto falha (mantém estilo “com logo”) */
  if (!domain || stage >= urls.length) {
    return (
      <FontAwesomeIcon
        icon={faBriefcase}
        className="h-6 w-6 text-neutral-700"
        aria-hidden
      />
    );
  }

  return (
    <img
      src={urls[stage]}
      alt=""
      width={32}
      height={32}
      className="h-8 w-8 object-contain"
      loading="lazy"
      decoding="async"
      onError={() => setStage((s) => s + 1)}
    />
  );
}

export default function Timeline() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { history } = c;
  const isDark = mode === "dark";
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = useCallback((i: number) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  }, []);

  const contentStyle = isDark
    ? { background: "white", color: "rgb(39, 40, 34)" }
    : { background: "#a8d4bc", color: "#14532d" };

  const arrowStyle = isDark
    ? { borderRight: "7px solid white" }
    : { borderRight: "7px solid #a8d4bc" };

  /** Círculo claro + anel roxo — empresas com logo */
  const iconStyleLogo = {
    background: "#f4f4f5",
    color: "rgb(39, 40, 34)",
    boxShadow:
      "0 0 0 3px #00FF41, inset 0 0 0 1px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  /** Original da timeline: círculo roxo sólido + maleta (sem logo, ex.: experiências iniciais) */
  const iconStyleClassic = {
    background: "#00FF41",
    color: "#030806",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  function SkillChip({
    label,
    variant,
  }: {
    label: string;
    variant: "hard" | "soft";
  }) {
    const base =
      "mb-1.5 mr-2 inline-flex max-w-full items-center rounded-lg px-3 py-1.5 text-left font-sans text-[0.8125rem] font-medium leading-snug tracking-normal antialiased sm:text-sm";
    const hard =
      "bg-[#00FF41] text-[#030806] shadow-sm shadow-[#00FF41]/20 [color-scheme:light]";
    const soft =
      "border border-emerald-200/90 bg-emerald-50/90 text-emerald-950 shadow-sm [color-scheme:light]";
    return (
      <span className={`${base} ${variant === "hard" ? hard : soft}`}>
        {label}
      </span>
    );
  }

  return (
    <div id="history" className={isDark ? "" : "light-app"}>
      <div className="flex flex-col justify-center px-[5%] py-[5%] text-left md:px-[10%]">
        <h1
          className={`mb-8 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionHeadingClass(isDark)}`}
        >
          <SectionTitleIcon
            name="history"
            className="h-9 w-9 shrink-0 md:h-10 md:w-10"
          />
          {t("nav_history")}
        </h1>
        <VerticalTimeline
          lineColor={isDark ? "rgba(0, 255, 65, 0.28)" : undefined}
        >
          {history.entries.map((entry, i) => {
            const isOpen = expanded[i] ?? false;
            const hasBody = entry.description.length > 0;
            const hard = (entry.hard_skills ?? []).filter(
              (s) => typeof s === "string" && s.trim(),
            );
            const soft = (entry.soft_skills ?? []).filter(
              (s) => typeof s === "string" && s.trim(),
            );
            const hasSkills =
              SHOW_HISTORY_SKILLS && (hard.length > 0 || soft.length > 0);
            const hasExpandable = hasBody || hasSkills;
            const hasCompanyLogo = Boolean(entry.logo_domain?.trim());
            return (
              <VerticalTimelineElement
                key={`job-${i}`}
                className="vertical-timeline-element--work"
                contentStyle={contentStyle}
                contentArrowStyle={arrowStyle}
                date={entry.date}
                dateClassName={isDark ? "" : "!text-neutral-600"}
                iconClassName={
                  hasCompanyLogo ? "" : "timeline-icon-classic-briefcase"
                }
                iconStyle={
                  hasCompanyLogo ? iconStyleLogo : iconStyleClassic
                }
                icon={
                  hasCompanyLogo ? (
                    <TimelineLogo domain={entry.logo_domain} />
                  ) : (
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      className="h-6 w-6 text-[#030806]"
                      aria-hidden
                    />
                  )
                }
              >
                <div className="vertical-timeline-element-title !mb-1 !text-lg !font-bold !leading-snug !text-neutral-900 md:!text-xl">
                  {entry.company}
                </div>
                <div className="mb-2 text-[0.9375rem] font-normal leading-normal text-neutral-600">
                  {entry.location}
                </div>
                <div
                  className={`mb-4 text-base font-semibold leading-snug md:text-lg ${isDark ? "text-[#00FF41]" : "text-emerald-700"}`}
                >
                  {entry.role}
                </div>
                {hasExpandable && (
                  <>
                    <button
                      type="button"
                      className={`mt-1 cursor-pointer border-0 bg-transparent p-0 pb-1 text-left text-sm font-semibold underline underline-offset-[3px] ${isDark ? "text-[#00FF41] decoration-[#00FF41]/40 hover:decoration-[#00FF41]" : "text-emerald-700 decoration-emerald-300 hover:decoration-emerald-600"}`}
                      aria-expanded={isOpen}
                      aria-controls={`history-desc-${i}`}
                      id={`history-toggle-${i}`}
                      onClick={() => toggle(i)}
                    >
                      {isOpen ? t("history_show_less") : t("history_show_more")}
                    </button>
                    {isOpen && (
                      <div
                        id={`history-desc-${i}`}
                        role="region"
                        aria-labelledby={`history-toggle-${i}`}
                        className="mt-3 space-y-4 border-t border-black/10 pt-3 text-left"
                      >
                        {hasBody && (
                          <div className="space-y-3 text-[0.92rem] leading-relaxed md:text-[0.95rem]">
                            {entry.description.map((para, j) => (
                              <p key={j} className="m-0 text-neutral-800">
                                {para}
                              </p>
                            ))}
                          </div>
                        )}
                        {hasSkills && (
                          <div
                            className={`space-y-3 ${hasBody ? "border-t border-neutral-200/80 pt-4" : ""}`}
                          >
                            {hard.length > 0 && (
                              <div>
                                <span className="mb-2 block text-xs font-semibold text-neutral-500 sm:text-sm">
                                  {t("history_hard_skills")}
                                </span>
                                <div className="flex flex-wrap">
                                  {hard.map((label, hi) => (
                                    <SkillChip
                                      key={`h-${i}-${hi}-${label}`}
                                      label={label.trim()}
                                      variant="hard"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            {soft.length > 0 && (
                              <div>
                                <span className="mb-2 block text-xs font-semibold text-neutral-500 sm:text-sm">
                                  {t("history_soft_skills")}
                                </span>
                                <div className="flex flex-wrap">
                                  {soft.map((label, si) => (
                                    <SkillChip
                                      key={`s-${i}-${si}-${label}`}
                                      label={label.trim()}
                                      variant="soft"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </div>
  );
}
