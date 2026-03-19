import { useCallback, useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";
import type { Locale } from "../types/locale";
import appConfig from "../data/config.json";
import {
  buildResumeHtml,
  type ResumeMode,
  defaultCustomResumeSelection,
  CUSTOM_RESUME_SECTION_ORDER,
  type CustomResumeSelection,
  type CustomResumeSectionKey,
} from "../resume/buildResumeHtml";
import { generateResumePdf } from "../resume/generateResumePdf";

const LOCALES: { value: Locale; label: string }[] = [
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
];

const SECTION_NAV_KEY: Record<CustomResumeSectionKey, string> = {
  expertise: "nav_expertise",
  certifications: "nav_certifications",
  history: "nav_history",
  education: "nav_education",
  languages: "nav_languages",
  hobbies: "nav_hobbies",
  projects: "nav_projects",
  personal_projects: "nav_personal_projects",
  courses: "nav_courses",
};

const RESUME_MODES: {
  value: ResumeMode;
  titleKey: string;
  hintKey: string;
}[] = [
  {
    value: "ultra_compact",
    titleKey: "resume_mode_ultra_compact",
    hintKey: "resume_mode_ultra_compact_hint",
  },
  { value: "compact", titleKey: "resume_mode_compact", hintKey: "resume_mode_compact_hint" },
  { value: "objective", titleKey: "resume_mode_objective", hintKey: "resume_mode_objective_hint" },
  { value: "favorito", titleKey: "resume_mode_favorito", hintKey: "resume_mode_favorito_hint" },
  { value: "complete", titleKey: "resume_mode_complete", hintKey: "resume_mode_complete_hint" },
  { value: "custom", titleKey: "resume_mode_custom", hintKey: "resume_mode_custom_hint" },
];

export default function ResumeDownload() {
  const mode = useThemeMode();
  const { locale: siteLocale, t } = useLocale();
  const isDark = mode === "dark";
  const panelId = useId();

  const [open, setOpen] = useState(false);
  const [pdfLang, setPdfLang] = useState<Locale>(siteLocale);
  const [pdfMode, setPdfMode] = useState<ResumeMode>("ultra_compact");
  const [customSel, setCustomSel] = useState<CustomResumeSelection>(
    defaultCustomResumeSelection,
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggleSection = (id: CustomResumeSectionKey) => {
    setCustomSel((s) => ({
      ...s,
      sections: { ...s.sections, [id]: !s.sections[id] },
    }));
  };

  const download = useCallback(async () => {
    setErr(null);
    setBusy(true);
    try {
      const configured = (appConfig as { site?: { portfolioUrl?: string } }).site?.portfolioUrl?.trim();
      const base = import.meta.env.BASE_URL || "/";
      const portfolioUrl =
        configured ||
        new URL(base, window.location.origin).href;
      const html = buildResumeHtml(pdfLang, pdfMode, {
        portfolioUrl,
        customSelection: pdfMode === "custom" ? customSel : undefined,
      });
      const name = `Tiago_Cosmai_CV_${pdfLang}_${pdfMode}.pdf`;
      await generateResumePdf(html, name);
    } catch {
      setErr(t("resume_pdf_error"));
    } finally {
      setBusy(false);
    }
  }, [pdfLang, pdfMode, customSel, t]);

  const border = isDark ? "border-white/15" : "border-black/10";
  const cardBg = isDark ? "bg-white/[0.04]" : "bg-white";
  const labelC = isDark ? "text-white/80" : "text-[#0d1116]/75";
  const titleC = isDark ? "text-white" : "text-[#0d1116]";
  const checkLabel = `flex cursor-pointer items-start gap-2.5 text-sm ${isDark ? "text-white" : "text-[#0d1116]"}`;

  const sectionTitle = sectionHeadingClass(isDark);

  return (
    <div className="mx-auto max-w-3xl">
      <h2
        className={`mb-6 flex items-center justify-center gap-3 text-2xl font-bold sm:text-3xl ${sectionTitle}`}
      >
        <SectionTitleIcon
          name="resume"
          className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
        />
        {t("resume_section_title")}
      </h2>
      <div
        className={`mb-8 rounded-xl border px-4 py-4 sm:px-6 ${border} ${cardBg}`}
      >
      <button
        type="button"
        id={`${panelId}-toggle`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full cursor-pointer items-center justify-center gap-2 text-center text-base font-semibold transition-colors sm:text-lg ${titleC} ${
          isDark ? "hover:text-[#00FF41]" : "hover:text-[#14532d]"
        }`}
      >
        <FontAwesomeIcon
          icon={faFilePdf}
          className={isDark ? "text-[#00FF41]" : "text-[#166534]"}
        />
        {t("resume_download_title")}
        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          className="text-sm opacity-70"
        />
      </button>

      {open ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={`${panelId}-toggle`}
          className="mt-5 space-y-5 border-t border-black/10 pt-5 dark:border-white/10"
        >
          <div>
            <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${labelC}`}>
              {t("resume_lang_label")}
            </p>
            <div className="flex flex-wrap gap-2">
              {LOCALES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPdfLang(value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    pdfLang === value
                      ? "border-[#00FF41] bg-[#00FF41] text-[#030806]"
                      : isDark
                        ? "border-white/20 text-white hover:border-[#00FF41]/50"
                        : "border-black/15 text-[#0d1116] hover:border-[#166534]/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${labelC}`}>
              {t("resume_mode_label")}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {RESUME_MODES.map(({ value, titleKey, hintKey }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPdfMode(value)}
                  className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                    pdfMode === value
                      ? isDark
                        ? "border-[#00FF41] bg-[#00FF41]/12 ring-2 ring-[#00FF41]/35"
                        : "border-[#166534] bg-[#166534]/12 ring-2 ring-[#166534]/30"
                      : isDark
                        ? "border-white/20 text-white hover:border-white/35"
                        : "border-black/15 text-[#0d1116] hover:border-black/25"
                  }`}
                >
                  <span className="block font-semibold">{t(titleKey)}</span>
                  <span className={`mt-0.5 block text-xs leading-snug ${labelC}`}>
                    {t(hintKey)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {pdfMode === "custom" ? (
            <div
              className={`space-y-4 rounded-xl border p-4 ${isDark ? "border-white/15 bg-white/[0.03]" : "border-black/10 bg-neutral-50/80"}`}
            >
              <p className={`text-xs leading-relaxed ${labelC}`}>
                {t("resume_custom_always_main")}
              </p>
              <div>
                <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${labelC}`}>
                  {t("resume_custom_sections_label")}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CUSTOM_RESUME_SECTION_ORDER.map((id) => (
                    <label key={id} className={checkLabel}>
                      <input
                        type="checkbox"
                        className={`mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 ${isDark ? "text-[#00FF41] focus:ring-[#00FF41]" : "text-[#166534] focus:ring-[#166534]"}`}
                        checked={customSel.sections[id]}
                        onChange={() => toggleSection(id)}
                      />
                      <span>{t(SECTION_NAV_KEY[id])}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${labelC}`}>
                  {t("resume_custom_options_label")}
                </p>
                <div className="flex flex-col gap-2.5">
                  {customSel.sections.certifications ? (
                    <label className={checkLabel}>
                      <input
                        type="checkbox"
                        className={`mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 ${isDark ? "text-[#00FF41] focus:ring-[#00FF41]" : "text-[#166534] focus:ring-[#166534]"}`}
                        checked={customSel.certificationsDetail}
                        onChange={(e) =>
                          setCustomSel((s) => ({
                            ...s,
                            certificationsDetail: e.target.checked,
                          }))
                        }
                      />
                      <span>{t("resume_custom_opt_certifications")}</span>
                    </label>
                  ) : null}
                  {customSel.sections.history ? (
                    <>
                      <label className={checkLabel}>
                        <input
                          type="checkbox"
                          className={`mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 ${isDark ? "text-[#00FF41] focus:ring-[#00FF41]" : "text-[#166534] focus:ring-[#166534]"}`}
                          checked={customSel.historyDetail}
                          onChange={(e) =>
                            setCustomSel((s) => ({
                              ...s,
                              historyDetail: e.target.checked,
                              showSkills: e.target.checked ? s.showSkills : false,
                            }))
                          }
                        />
                        <span>{t("resume_custom_opt_history")}</span>
                      </label>
                      {customSel.historyDetail ? (
                        <label className={`${checkLabel} pl-6`}>
                          <input
                            type="checkbox"
                            className={`mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 ${isDark ? "text-[#00FF41] focus:ring-[#00FF41]" : "text-[#166534] focus:ring-[#166534]"}`}
                            checked={customSel.showSkills}
                            onChange={(e) =>
                              setCustomSel((s) => ({
                                ...s,
                                showSkills: e.target.checked,
                              }))
                            }
                          />
                          <span>{t("resume_custom_opt_skills")}</span>
                        </label>
                      ) : null}
                    </>
                  ) : null}
                  {customSel.sections.education ? (
                    <label className={checkLabel}>
                      <input
                        type="checkbox"
                        className={`mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 ${isDark ? "text-[#00FF41] focus:ring-[#00FF41]" : "text-[#166534] focus:ring-[#166534]"}`}
                        checked={customSel.educationDetail}
                        onChange={(e) =>
                          setCustomSel((s) => ({
                            ...s,
                            educationDetail: e.target.checked,
                          }))
                        }
                      />
                      <span>{t("resume_custom_opt_education")}</span>
                    </label>
                  ) : null}
                  {customSel.sections.languages ? (
                    <label className={checkLabel}>
                      <input
                        type="checkbox"
                        className={`mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-400 ${isDark ? "text-[#00FF41] focus:ring-[#00FF41]" : "text-[#166534] focus:ring-[#166534]"}`}
                        checked={customSel.languagesDetail}
                        onChange={(e) =>
                          setCustomSel((s) => ({
                            ...s,
                            languagesDetail: e.target.checked,
                          }))
                        }
                      />
                      <span>{t("resume_custom_opt_languages")}</span>
                    </label>
                  ) : null}
                  {!customSel.sections.certifications &&
                  !customSel.sections.history &&
                  !customSel.sections.education &&
                  !customSel.sections.languages ? (
                    <p className={`text-xs ${labelC}`}>
                      {t("resume_custom_no_detail_opts")}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {err ? (
            <p className="text-center text-sm text-red-500 dark:text-red-400" role="alert">
              {err}
            </p>
          ) : null}

          <p className={`text-center text-xs ${labelC}`}>{t("resume_print_hint")}</p>

          <button
            type="button"
            disabled={busy}
            onClick={() => void download()}
            className="w-full rounded-lg bg-[#00FF41] py-3 text-sm font-semibold text-[#030806] shadow-md shadow-[#00FF41]/20 transition-opacity hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? t("resume_generating") : t("resume_generate_pdf")}
          </button>
        </div>
      ) : null}
      </div>
    </div>
  );
}
