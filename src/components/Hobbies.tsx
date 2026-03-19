import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBeer,
  faFilm,
  faFlagCheckered,
  faFootballBall,
  faFutbol,
  faGamepad,
  faHeart,
  faLaptopCode,
  faLayerGroup,
  faMusic,
  faMugHot,
  faPersonRunning,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

const HOBBY_ICONS: Record<string, IconDefinition> = {
  music: faMusic,
  tv: faTv,
  film: faFilm,
  futbol: faFutbol,
  football: faFootballBall,
  flagCheckered: faFlagCheckered,
  gamepad: faGamepad,
  laptopCode: faLaptopCode,
  personRunning: faPersonRunning,
  beer: faBeer,
  mugHot: faMugHot,
  layerGroup: faLayerGroup,
  heart: faHeart,
};

export default function Hobbies() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { hobbies } = c;
  const isDark = mode === "dark";
  const sectionTitle = sectionHeadingClass(isDark);
  const tagBg = isDark
    ? "border-white/20 bg-white/[0.06] text-white/95"
    : "border-black/10 bg-white text-[#0d1116] shadow-sm";

  if (!hobbies?.items?.length) return null;

  return (
    <section
      id="hobbies"
      className="scroll-mt-20 px-[5%] py-[5%] md:px-[10%]"
    >
      <h2
        className={`mb-8 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
      >
        <SectionTitleIcon
          name="hobbies"
          className="h-9 w-9 shrink-0 md:h-10 md:w-10"
        />
        {t("nav_hobbies")}
      </h2>
      <ul className="flex flex-wrap gap-3">
        {hobbies.items.map((item, i) => {
          const icon = HOBBY_ICONS[item.icon] ?? faHeart;
          return (
            <li key={i}>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${tagBg}`}
              >
                <FontAwesomeIcon
                  icon={icon}
                  className={`h-4 w-4 shrink-0 ${isDark ? "text-[#00FF41]" : "text-[#14532d]"}`}
                  aria-hidden
                />
                <span>{item.label}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
