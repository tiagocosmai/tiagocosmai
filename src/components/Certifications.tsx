import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { sectionHeadingClass } from "../lib/sectionHeading";
import { SectionTitleIcon } from "../lib/sectionIcons";

const CREDLY_WALLET = "https://www.credly.com/users/tiago-cosmai/badges";

export default function Certifications() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { certifications } = c;
  const isDark = mode === "dark";
  const titleC = isDark ? "text-white" : "text-[#0d1116]";
  const sectionTitle = sectionHeadingClass(isDark);
  const cardBg = isDark
    ? "border-white/15 bg-white/[0.06]"
    : "border-black/10 bg-white shadow-sm";
  const linkC = isDark
    ? "font-semibold text-[#00FF41] underline decoration-[#00FF41]/40 underline-offset-2 hover:decoration-[#00FF41]"
    : "font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:decoration-emerald-600";

  return (
    <section
      id="certifications"
      className="scroll-mt-20 px-[5%] py-[5%] md:px-[10%]"
    >
      <h2
        className={`mb-3 flex items-center gap-3 text-3xl font-bold md:text-4xl ${sectionTitle}`}
      >
        <SectionTitleIcon
          name="certifications"
          className="h-9 w-9 shrink-0 md:h-10 md:w-10"
        />
        {t("nav_certifications")}
      </h2>
      <p
        className={`mb-2 max-w-2xl text-sm leading-relaxed md:text-base ${isDark ? "text-white/70" : "text-[#0d1116]/70"}`}
      >
        {t("certifications_credly_intro")}{" "}
        <a
          href={CREDLY_WALLET}
          target="_blank"
          rel="noopener noreferrer"
          className={linkC}
        >
          {t("certifications_credly_wallet")}
        </a>
        .
      </p>
      <div className="mb-10 h-px w-full max-w-md bg-black/10 dark:bg-white/15" aria-hidden />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {certifications.items.map((item, i) => (
          <article
            key={i}
            className={`flex min-h-0 gap-3 overflow-hidden rounded-lg border p-3 sm:gap-3.5 sm:p-3.5 ${cardBg}`}
          >
            <div
              className={`flex w-[4.5rem] shrink-0 flex-col items-center justify-center self-stretch rounded-md px-1 py-2 sm:w-[5.25rem] ${isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`}
            >
              <img
                src={item.image_url}
                alt=""
                className="max-h-16 w-full max-w-[4.5rem] object-contain sm:max-h-[4.5rem]"
                loading="lazy"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
              <h3
                className={`mb-1 text-sm font-semibold leading-snug sm:text-[0.9375rem] ${titleC}`}
              >
                {item.title}
              </h3>
              <p
                className={`m-0 text-xs leading-relaxed sm:text-[0.8125rem] ${isDark ? "text-white/72" : "text-[#0d1116]/72"}`}
              >
                {item.description}
              </p>
              {item.credly_url ? (
                <a
                  href={item.credly_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 inline-flex w-fit text-xs font-semibold ${linkC}`}
                >
                  {t("certifications_verify_credly")} ↗
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
