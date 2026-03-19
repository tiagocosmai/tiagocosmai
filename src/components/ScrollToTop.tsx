import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";

const SHOW_AFTER_PX = 320;

export default function ScrollToTop() {
  const mode = useThemeMode();
  const { t } = useLocale();
  const isDark = mode === "dark";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t("scroll_to_top")}
      title={t("scroll_to_top")}
      className={`fixed bottom-6 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 md:bottom-8 md:right-8 ${
        isDark
          ? "bg-[#00FF41] text-[#030806] shadow-[#00FF41]/25 hover:brightness-110"
          : "bg-[#00FF41] text-[#030806] shadow-emerald-500/25 hover:brightness-105"
      } ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <FontAwesomeIcon icon={faArrowUp} className="h-5 w-5" aria-hidden />
    </button>
  );
}
