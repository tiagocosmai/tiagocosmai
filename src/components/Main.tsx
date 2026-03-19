import appConfig from "../data/config.json";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import { SocialLinksRow } from "./SocialLinksRow";

const MATRIX_DARK_LAYERS = `
  linear-gradient(rgba(3, 8, 4, 0.97), rgba(2, 12, 4, 0.98)),
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.025) 2px,
    rgba(0, 255, 65, 0.025) 4px
  ),
  radial-gradient(ellipse 120% 70% at 50% -5%, rgba(0, 255, 65, 0.12), transparent 50%),
  radial-gradient(ellipse 60% 40% at 100% 100%, rgba(0, 180, 60, 0.06), transparent 50%),
  linear-gradient(180deg, #010403 0%, #031008 42%, #020805 100%)
`;

const MATRIX_LIGHT_LAYERS = `
  linear-gradient(180deg, #f0fdf4 0%, #ecfdf3 38%, #f7fef9 100%),
  repeating-linear-gradient(
    90deg,
    transparent,
    transparent 72px,
    rgba(16, 185, 129, 0.06) 72px,
    rgba(16, 185, 129, 0.06) 73px
  ),
  radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34, 197, 94, 0.08), transparent 55%)
`;

export default function Main() {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { main } = c;
  const isDark = mode === "dark";
  const introMax =
    (appConfig.site as { mainIntroParagraphsMax?: number })
      .mainIntroParagraphsMax ?? 2;
  const introParagraphs = (main.intro_paragraphs ?? []).slice(0, introMax);

  const nameClass = isDark ? "text-white" : "text-[#0d1116]";
  const roleClass = isDark
    ? "text-[#00FF41] drop-shadow-[0_0_12px_rgba(0,255,65,0.35)]"
    : "text-[#14532d]";
  const borderIntro = isDark ? "border-[#00FF41]/75" : "border-[#166534]";
  const introText = isDark ? "text-[#b8e6bf]/95" : "text-[#14532d]/95";

  return (
    <div className="mt-16 flex w-full flex-col items-center">
      <section className="relative flex min-h-[calc(100dvh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-[5%] py-12 md:min-h-[min(100dvh,960px)] md:py-16">
        <div
          className="absolute inset-0 z-0 bg-cover bg-fixed bg-center bg-no-repeat"
          style={{
            backgroundImage: isDark ? MATRIX_DARK_LAYERS : MATRIX_LIGHT_LAYERS,
          }}
          aria-hidden
        />
        {isDark ? (
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]"
            aria-hidden
          />
        ) : null}

        <div className="relative z-[2] mx-auto flex w-full max-w-2xl flex-col">
          <div className="flex justify-center">
            <img
              src={main.avatar_url}
              alt={t("alt_avatar")}
              className="h-[240px] w-[240px] rounded-full object-cover md:h-[276px] md:w-[276px]"
            />
          </div>

          <h1
            className={`m-0 mt-8 text-center text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:mt-10 md:text-6xl ${nameClass}`}
          >
            {main.name}
          </h1>

          <p
            className={`m-0 mt-4 w-full text-center text-xl font-semibold md:text-2xl ${roleClass}`}
          >
            {main.role}
          </p>

          {introParagraphs.length ? (
            <div
              className={`mt-6 w-full space-y-4 border-l-[3px] ${borderIntro} pl-4 text-left text-[0.95rem] leading-relaxed md:text-base ${introText}`}
            >
              {introParagraphs.map((paragraph, i) => (
                <p key={i} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          <SocialLinksRow
            variant="hero"
            className="mt-8 w-full justify-center"
          />
        </div>
      </section>
    </div>
  );
}
