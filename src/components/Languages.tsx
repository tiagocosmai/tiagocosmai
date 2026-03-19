import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";
import { BRFlag, ESFlag, USFlag } from "./Flags";

const LANG_FLAGS = {
  br: BRFlag,
  us: USFlag,
  es: ESFlag,
} as const;

const SKILL_KEYS = [
  "lang_skill_communication",
  "lang_skill_conversation",
  "lang_skill_reading",
  "lang_skill_writing",
] as const;

const SKILL_FIELDS = [
  "communication",
  "conversation",
  "reading",
  "writing",
] as const;

export function Languages() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { languages } = c;
  const isDark = mode === "dark";
  const titleC = isDark ? "text-white" : "text-[#0d1116]";
  const sectionTitle = sectionHeadingClass(isDark);
  const cardBg = isDark
    ? "border-white/15 bg-white/[0.06]"
    : "border-black/10 bg-white shadow-sm";
  const muted = isDark ? "text-white/70" : "text-[#0d1116]/70";
  const labelC = isDark ? "text-[#00FF41]" : "text-[#166534]";

  return (
    <section
      id="languages"
      className="scroll-mt-20 px-[5%] py-[5%] md:px-[10%]"
    >
      <h2
        className={`mb-10 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
      >
        <SectionTitleIcon
          name="languages"
          className={`h-9 w-9 shrink-0 md:h-10 md:w-10 ${sectionTitle}`}
        />
        {t("nav_languages")}
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {languages.items.map((item, i) => (
          <article
            key={i}
            className={`flex flex-col rounded-xl border p-5 md:p-6 ${cardBg}`}
          >
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-black/10 pb-4 dark:border-white/10">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div
                  className={`shrink-0 overflow-hidden rounded-lg shadow-sm ${
                    isDark
                      ? "ring-2 ring-white/20"
                      : "ring-2 ring-black/[0.12]"
                  }`}
                  aria-hidden
                >
                  {(() => {
                    const Flag = LANG_FLAGS[item.flag];
                    return Flag ? (
                      <Flag className="h-14 w-14" />
                    ) : null;
                  })()}
                </div>
                <h3 className={`min-w-0 text-xl font-bold ${titleC}`}>
                  {item.name}
                </h3>
              </div>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                  isDark
                    ? "bg-[#00FF41]/20 text-[#00FF41]"
                    : "bg-[#166534]/18 text-[#14532d]"
                }`}
              >
                {item.level}
              </span>
            </div>
            <dl className="m-0 flex flex-1 flex-col gap-4">
              {SKILL_FIELDS.map((field, j) => (
                <div key={field}>
                  <dt
                    className={`mb-1 text-xs font-bold uppercase tracking-wider ${labelC}`}
                  >
                    {t(SKILL_KEYS[j])}
                  </dt>
                  <dd className={`m-0 text-sm leading-relaxed ${muted}`}>
                    {item[field]}
                  </dd>
                </div>
              ))}
            </dl>
            {item.note ? (
              <div
                className={`mt-4 rounded-r-lg border-l-4 py-2 pl-3 pr-2 ${
                  isDark
                    ? "border-[#00FF41] bg-white/[0.04]"
                    : "border-[#166534] bg-[#d4eadc]/90"
                }`}
              >
                <p
                  className={`m-0 text-xs font-semibold uppercase tracking-wide ${labelC}`}
                >
                  {t("lang_note_label")}
                </p>
                <p className={`mt-1.5 m-0 text-sm leading-relaxed ${muted}`}>
                  {item.note}
                </p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
