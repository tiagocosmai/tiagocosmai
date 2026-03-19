import { useMemo } from "react";
import coursesData from "../data/courses.json";
import {
  localizeCourseLine,
  localizeCourseProvider,
  type CoursesDataPt,
} from "../lib/courseI18n";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

export default function Courses() {
  const mode = useThemeMode();
  const { t, locale } = useLocale();
  const isDark = mode === "dark";
  const sectionTitle = sectionHeadingClass(isDark);
  const muted = isDark ? "text-white/75" : "text-[#0d1116]/75";
  const providerNameC = isDark ? "text-[#00FF41]" : "text-[#14532d]";
  const linkC = isDark
    ? "text-[#00FF41] hover:underline"
    : "text-[#14532d] hover:underline decoration-[#166534]";

  const { distanceGroups, presentialItems, eventItems } = useMemo(() => {
    const d = coursesData as CoursesDataPt;
    return {
      distanceGroups: d.distance.map((g) => ({
        provider: localizeCourseProvider(g.provider, locale),
        url: g.url,
        items: g.items.map((it) => localizeCourseLine(it.pt, locale)),
      })),
      presentialItems: d.presential.map((it) => localizeCourseLine(it.pt, locale)),
      eventItems: d.events.map((it) => localizeCourseLine(it.pt, locale)),
    };
  }, [locale]);

  const colClass =
    "columns-1 gap-x-8 [column-fill:_balance] md:columns-2 lg:columns-3";

  return (
    <section id="courses" className="scroll-mt-20 px-[5%] py-[5%] md:px-[10%]">
      <h2
        className={`mb-10 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
      >
        <SectionTitleIcon
          name="courses"
          className="h-9 w-9 shrink-0 md:h-10 md:w-10"
        />
        {t("nav_courses")}
      </h2>

      <div className="space-y-14">
        <div>
          <h3 className={`mb-8 text-xl font-semibold md:text-2xl ${sectionTitle}`}>
            {t("courses_section_distance")}
          </h3>
          <div className="space-y-10">
            {distanceGroups.map((g) => (
              <div key={g.provider}>
                <h4 className="mb-1 text-lg font-medium">
                  {g.url ? (
                    <a
                      href={g.url}
                      target="_blank"
                      rel="noreferrer"
                      className={linkC}
                    >
                      {g.provider}
                    </a>
                  ) : (
                    <span className={providerNameC}>{g.provider}</span>
                  )}
                </h4>
                <ul className={`${colClass} text-sm leading-relaxed ${muted}`}>
                  {g.items.map((line, i) => (
                    <li
                      key={i}
                      className="mb-2 break-inside-avoid pl-1"
                      style={{ pageBreakInside: "avoid" }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`mb-6 text-xl font-semibold md:text-2xl ${sectionTitle}`}>
            {t("courses_section_presential")}
          </h3>
          <ul className={`${colClass} text-sm leading-relaxed ${muted}`}>
            {presentialItems.map((line, i) => (
              <li
                key={i}
                className="mb-2 break-inside-avoid pl-1"
                style={{ pageBreakInside: "avoid" }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={`mb-6 text-xl font-semibold md:text-2xl ${sectionTitle}`}>
            {t("courses_section_events")}
          </h3>
          <ul className={`${colClass} text-sm leading-relaxed ${muted}`}>
            {eventItems.map((line, i) => (
              <li
                key={i}
                className="mb-2 break-inside-avoid pl-1"
                style={{ pageBreakInside: "avoid" }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
