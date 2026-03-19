import { Cpu, Network } from "lucide-react";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

const ICONS = {
  cpu: Cpu,
  network: Network,
} as const;

function Chip({ label }: { label: string }) {
  const mode = useThemeMode();
  const isDark = mode === "dark";
  return (
    <span
      className={`mb-1 mr-2 inline-flex min-h-[25px] items-center rounded-full px-2.5 py-0.5 text-center font-mono text-[0.75rem] leading-tight sm:text-[0.8rem] ${
        isDark
          ? "bg-white text-[#272822] shadow-sm"
          : "bg-black/10 text-[#0d1116] shadow-md"
      }`}
    >
      {label}
    </span>
  );
}

export default function Expertise() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { expertise } = c;
  const isDark = mode === "dark";
  const iconColor = sectionHeadingClass(isDark);
  const sectionTitle = sectionHeadingClass(isDark);
  const bodyText = isDark ? "text-white/92" : "text-[#0d1116]";

  return (
    <div
      className="mt-16 flex w-full flex-col items-center justify-center"
      id="expertise"
    >
      <div className="flex w-full flex-col px-[5%] py-[5%] text-left md:px-[10%]">
        <h1
          className={`mb-8 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
        >
          <SectionTitleIcon
            name="expertise"
            className="h-9 w-9 shrink-0 md:h-10 md:w-10"
          />
          {t("nav_expertise")}
        </h1>
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-16">
          {expertise.cards.map((card, i) => {
            const Icon = ICONS[card.icon];
            return (
              <div key={`exp-${i}`} className="text-left">
                <Icon
                  className={`mb-4 h-12 w-12 ${iconColor}`}
                  strokeWidth={1.35}
                  aria-hidden
                />
                <h3 className={`mb-4 text-xl font-semibold md:text-2xl ${sectionTitle}`}>
                  {card.title}
                </h3>
                <div className={`mb-5 space-y-3 leading-relaxed ${bodyText}`}>
                  {card.descriptions.map((paragraph, j) => (
                    <p key={j} className="m-0 text-[0.95rem] md:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="leading-8">
                  <div className="flex flex-wrap gap-x-0 gap-y-1">
                    {card.stack.map((label) => (
                      <Chip key={label} label={label} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
