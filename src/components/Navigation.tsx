import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import type { ThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";
import type { Locale } from "../types/locale";
import { LANGUAGE_OPTIONS, LocaleFlag } from "./Flags";
import { SHOW_CONTACT } from "../config/features";
import { SECTION_ICONS, type SectionIconKey } from "../lib/sectionIcons";

const NAV_ENTRIES: { id: string; key: string; icon: SectionIconKey }[] = [
  { id: "expertise", key: "nav_expertise", icon: "expertise" },
  { id: "certifications", key: "nav_certifications", icon: "certifications" },
  { id: "history", key: "nav_history", icon: "history" },
  { id: "education", key: "nav_education", icon: "education" },
  { id: "languages", key: "nav_languages", icon: "languages" },
  { id: "projects", key: "nav_projects", icon: "projects" },
  { id: "personal-projects", key: "nav_personal_projects", icon: "personal_projects" },
  { id: "courses", key: "nav_courses", icon: "courses" },
  { id: "hobbies", key: "nav_hobbies", icon: "hobbies" },
  { id: "resume", key: "nav_resume", icon: "resume" },
  { id: "contact", key: "nav_contact", icon: "contact" },
];

const visibleNav = SHOW_CONTACT
  ? NAV_ENTRIES
  : NAV_ENTRIES.filter((e) => e.id !== "contact");

type Props = {
  mode: ThemeMode;
  modeChange: () => void;
};

const SITE_BRAND = "Portifólio - Tiago Cosmai";

function LanguageMenu({
  isDark,
  t,
  locale,
  setLocale,
  compact,
  menuAlign = "end",
}: {
  isDark: boolean;
  t: (k: string) => string;
  locale: Locale;
  setLocale: (l: Locale) => void;
  compact: boolean;
  /** end = dropdown à direita do botão; start = à esquerda (cabeçalho alinhado à esquerda) */
  menuAlign?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_OPTIONS.find((o) => o.value === locale)!;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const shell = isDark
    ? "border-white/25 bg-white/10 text-white"
    : "border-black/15 bg-white text-[#0d1116]";
  const listBg = isDark ? "bg-[#0a120a] border-[#00FF41]/20" : "bg-white border-black/10";
  const itemHover = isDark ? "hover:bg-white/10" : "hover:bg-black/5";
  const itemActive = isDark ? "bg-white/15" : "bg-black/10";

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <span
          className={`text-sm font-medium ${isDark ? "text-white" : "text-[#0d1116]"}`}
        >
          {t("lang_select_aria")}
        </span>
        <div className="flex flex-col gap-1">
          {LANGUAGE_OPTIONS.map(({ value, label, Flag }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setLocale(value);
              }}
              className={`flex w-full items-center gap-3 rounded-lg border border-black/10 px-3 py-2.5 text-left transition-colors ${
                isDark ? "text-white" : "text-[#0d1116]"
              } ${
                locale === value
                  ? isDark
                    ? "border-[#00FF41]/40 bg-[#00FF41]/12"
                    : "border-[#166534]/35 bg-[#166534]/12"
                  : isDark
                    ? "bg-white/5"
                    : "bg-neutral-50"
              }`}
            >
              <Flag className="h-7 w-7" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative"
      ref={wrapRef}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("lang_select_aria")}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 outline-none transition-colors focus:ring-2 ${isDark ? "focus:ring-[#00FF41]" : "focus:ring-[#166534]"} ${shell}`}
      >
        <LocaleFlag locale={locale} className="h-5 w-5" />
        <span className="min-w-[2ch] text-sm font-medium">{current.label}</span>
        <span
          className={`text-xs ${isDark ? "text-white/70" : "text-neutral-500"}`}
          aria-hidden
        >
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open ? (
        <ul
          role="listbox"
          className={`absolute z-[60] mt-1 min-w-[9rem] overflow-hidden rounded-lg border py-1 shadow-lg ${menuAlign === "start" ? "left-0" : "right-0"} ${listBg}`}
        >
          {LANGUAGE_OPTIONS.map(({ value, label, Flag }) => (
            <li key={value} role="option" aria-selected={locale === value}>
              <button
                type="button"
                onClick={() => {
                  setLocale(value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm ${isDark ? "text-white" : "text-[#0d1116]"} ${itemHover} ${locale === value ? itemActive : ""}`}
              >
                <Flag className="h-5 w-5" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function Navigation({ mode, modeChange }: Props) {
  const { locale, setLocale, t } = useLocale();
  const isDark = mode === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navigation");
      if (navbar) setScrolled(window.scrollY > navbar.clientHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!navDropdownOpen) return;
    const close = (e: MouseEvent) => {
      if (!navDropdownRef.current?.contains(e.target as Node)) setNavDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [navDropdownOpen]);

  const scrollToSection = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
    setNavDropdownOpen(false);
  };

  const linkClass = isDark
    ? "text-white hover:text-[#00FF41]"
    : "text-[#0d1116] hover:text-[#14532d]";

  const navDropdownShell = isDark
    ? "border-white/25 bg-white/10 text-white"
    : "border-black/15 bg-white text-[#0d1116]";
  const navDropdownList = isDark ? "bg-[#0a120a] border-[#00FF41]/20" : "bg-white border-black/10";
  const navDropdownItemHover = isDark ? "hover:bg-white/10" : "hover:bg-black/5";

  return (
    <>
      <header
        id="navigation"
        className={`fixed top-0 right-0 left-0 z-50 transition-shadow duration-300 ${
          isDark ? "bg-[#030806]" : "bg-[#f0fdf7]"
        } ${scrolled ? "shadow-md shadow-black/15" : ""}`}
      >
        <div
          className={`mx-auto flex h-16 max-w-[100vw] items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8 ${linkClass}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-lg p-2 sm:hidden"
              aria-label={t("open_menu")}
              onClick={() => setMobileOpen(true)}
            >
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={modeChange}
              className={`shrink-0 cursor-pointer rounded-full p-2 transition-colors ${
                isDark
                  ? "text-white hover:bg-white/10"
                  : "text-neutral-800 hover:bg-black/10"
              }`}
              aria-label={isDark ? t("theme_light") : t("theme_dark")}
            >
              <FontAwesomeIcon
                icon={isDark ? faSun : faMoon}
                className={`h-5 w-5 ${isDark ? "text-white" : "text-neutral-800"}`}
              />
            </button>

            <LanguageMenu
              isDark={isDark}
              t={t}
              locale={locale}
              setLocale={setLocale}
              compact={false}
              menuAlign="start"
            />

            <span
              className={`min-w-0 truncate text-sm font-semibold tracking-tight sm:text-base md:text-lg ${isDark ? "text-white" : "text-[#0d1116]"}`}
            >
              {SITE_BRAND}
            </span>
          </div>

          {/* Menu suspenso (estilo select): visível de sm até antes de 2xl */}
          <div
            ref={navDropdownRef}
            className="relative hidden shrink-0 sm:block 2xl:hidden"
            onKeyDown={(e) => e.key === "Escape" && setNavDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setNavDropdownOpen((o) => !o)}
              aria-label={t("menu_title")}
              aria-expanded={navDropdownOpen}
              aria-haspopup="listbox"
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium outline-none transition-colors focus:ring-2 ${isDark ? "focus:ring-[#00FF41]" : "focus:ring-[#166534]"} ${navDropdownShell}`}
            >
              <FontAwesomeIcon icon={faList} className="h-4 w-4 shrink-0" />
              <span>{t("menu_title")}</span>
              <span
                className={`text-xs ${isDark ? "text-white/70" : "text-neutral-500"}`}
                aria-hidden
              >
                {navDropdownOpen ? "▲" : "▼"}
              </span>
            </button>
            {navDropdownOpen ? (
              <ul
                role="listbox"
                className={`absolute right-0 z-[60] mt-1 max-h-[70vh] min-w-[12rem] overflow-auto rounded-lg border py-1 shadow-lg ${navDropdownList}`}
              >
                {visibleNav.map(({ id, key, icon }) => {
                  const NavIcon = SECTION_ICONS[icon];
                  return (
                    <li key={id} role="option">
                      <button
                        type="button"
                        onClick={() => scrollToSection(id)}
                        className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm ${isDark ? "text-white" : "text-[#0d1116]"} ${navDropdownItemHover}`}
                      >
                        <NavIcon
                          className={`h-4 w-4 shrink-0 ${isDark ? "text-[#00FF41]" : "text-[#14532d]"}`}
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        {t(key)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* Lista horizontal de links: visível apenas em 2xl e acima */}
          <nav className="hidden shrink-0 items-center justify-end gap-0.5 2xl:flex md:gap-1">
            {visibleNav.map(({ id, key, icon }) => {
              const NavIcon = SECTION_ICONS[icon];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className={`inline-flex items-center gap-1 rounded-lg px-1.5 py-2 text-[0.85rem] font-normal capitalize transition-colors md:gap-1.5 md:px-2.5 md:text-[0.95rem] lg:text-[1.02rem] ${linkClass}`}
                >
                  <NavIcon
                    className={`h-4 w-4 shrink-0 md:h-[1.05rem] md:w-[1.05rem] ${
                      isDark ? "text-[#00FF41]" : "text-[#14532d]"
                    }`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  {t(key)}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] sm:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label={t("close_menu")}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 flex h-full w-72 max-w-[85vw] flex-col bg-white text-[#0d1116] shadow-xl">
            <div className="flex flex-col gap-3 border-b border-black/10 px-4 py-4">
              <div className="flex items-center justify-center gap-2 font-bold">
                <FontAwesomeIcon icon={faList} />
                {t("menu_title")}
              </div>
              <LanguageMenu
                isDark={false}
                t={t}
                locale={locale}
                setLocale={setLocale}
                compact
              />
            </div>
            <ul className="flex flex-col p-2">
              {visibleNav.map(({ id, key, icon }) => {
                const NavIcon = SECTION_ICONS[icon];
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-[#0d1116] transition-colors hover:bg-black/5"
                    >
                      <NavIcon
                        className="h-5 w-5 shrink-0 text-[#166534]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      {t(key)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
