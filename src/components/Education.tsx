import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

const EDU_LOGO_LOCAL: Record<string, string> = {
  "faculdadesalvadorarena.org.br": "salvadorarena",
  "educacao.sp.gov.br": "etec",
  "sp.senai.br": "senai_sp",
};

function EducationLogo({
  domain,
  logo,
}: {
  domain?: string;
  logo?: string;
}) {
  const [stage, setStage] = useState(0);
  const urls: string[] = [];
  if (logo?.trim()) {
    const p = logo.trim();
    urls.push(p.startsWith("/") ? p : `/education-logos/${p}`);
  }
  if (domain?.trim()) {
    const slug = EDU_LOGO_LOCAL[domain.trim()];
    if (slug) urls.push(`/education-logos/${slug}.png`);
    urls.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain.trim())}&sz=128`,
    );
  }

  if (urls.length === 0 || stage >= urls.length) {
    return (
      <FontAwesomeIcon
        icon={faGraduationCap}
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

export default function Education() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { education } = c;
  const isDark = mode === "dark";

  const contentStyle = isDark
    ? { background: "white", color: "rgb(39, 40, 34)" }
    : { background: "#a8d4bc", color: "#14532d" };

  const arrowStyle = isDark
    ? { borderRight: "7px solid white" }
    : { borderRight: "7px solid #a8d4bc" };

  const iconStyleLogo = {
    background: "#f4f4f5",
    color: "white",
    boxShadow:
      "0 0 0 3px #00FF41, inset 0 0 0 1px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  const iconStyleClassic = {
    background: "#00FF41",
    color: "#030806",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as const;

  return (
    <div id="education" className={isDark ? "" : "light-app"}>
      <div className="flex flex-col justify-center px-[5%] py-[5%] text-left md:px-[10%]">
        <h2
          className={`mb-8 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionHeadingClass(isDark)}`}
        >
          <SectionTitleIcon
            name="education"
            className="h-9 w-9 shrink-0 md:h-10 md:w-10"
          />
          {t("nav_education")}
        </h2>
        <VerticalTimeline
          lineColor={isDark ? "rgba(0, 255, 65, 0.28)" : undefined}
        >
          {education.entries.map((entry, i) => {
            const hasLogo = Boolean(
              entry.logo_domain?.trim() || entry.logo?.trim(),
            );
            return (
              <VerticalTimelineElement
                key={`edu-${i}`}
                className="vertical-timeline-element--education"
                contentStyle={contentStyle}
                contentArrowStyle={arrowStyle}
                date={entry.date}
                dateClassName={isDark ? "" : "!text-neutral-600"}
                iconStyle={hasLogo ? iconStyleLogo : iconStyleClassic}
                icon={
                  hasLogo ? (
                    <EducationLogo
                      domain={entry.logo_domain}
                      logo={entry.logo}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      className="h-6 w-6 text-[#030806]"
                      aria-hidden
                    />
                  )
                }
              >
                <h3 className="vertical-timeline-element-title !mb-1 !text-lg !font-bold !text-neutral-900 md:!text-xl">
                  {entry.location}
                </h3>
                <h4
                  className={`vertical-timeline-element-subtitle !mb-2 !text-base !font-semibold md:!text-lg ${isDark ? "!text-[#00FF41]" : "!text-emerald-700"}`}
                >
                  {entry.title}
                </h4>
                <p className="!m-0 !text-[0.92rem] !leading-relaxed text-neutral-700 md:!text-[0.95rem]">
                  {entry.description}
                </p>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    </div>
  );
}
