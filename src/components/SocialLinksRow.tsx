import { useCallback, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faPlaystation,
  faSpotify,
  faSteam,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faAward,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useThemeMode } from "../context/ThemeContext";
import { useLocale } from "../context/LocaleContext";

type Variant = "hero" | "footer";

export function SocialLinksRow({
  variant,
  className = "",
}: {
  variant: Variant;
  className?: string;
}) {
  const mode = useThemeMode();
  const { c, t } = useLocale();
  const { main } = c;
  const isDark = mode === "dark";
  const [discordCopied, setDiscordCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyDiscord = useCallback(async () => {
    const user = main.social.discord?.trim();
    if (!user || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(user);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      setDiscordCopied(true);
      copyTimer.current = setTimeout(() => setDiscordCopied(false), 2200);
    } catch {
      /* ignore */
    }
  }, [main.social.discord]);

  const hoverGreen = isDark ? "hover:text-[#00FF41]" : "hover:text-[#14532d]";
  const iconColor =
    variant === "footer"
      ? isDark
        ? `text-white ${hoverGreen}`
        : `text-[#0d1116] ${hoverGreen}`
      : isDark
        ? "text-white"
        : "text-[#0d1116]";
  const rowClass =
    variant === "footer"
      ? `flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[1.25em] sm:text-[1.35em] ${iconColor}`
      : `flex flex-row flex-wrap items-center gap-x-3 gap-y-2 text-[1.65em] md:text-[1.75em] ${iconColor}`;
  const linkHover = `transition-colors ${hoverGreen}`;
  const iconBtn =
    "inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0";

  return (
    <div className={`${rowClass} ${className}`.trim()}>
      <a
        href={main.social.github}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_github")}
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <a
        href={main.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_linkedin")}
      >
        <FontAwesomeIcon icon={faLinkedin} />
      </a>
      <a
        href={main.social.credly}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_credly")}
      >
        <FontAwesomeIcon icon={faAward} />
      </a>
      <a
        href={main.social.steam}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_steam")}
      >
        <FontAwesomeIcon icon={faSteam} />
      </a>
      <a
        href={main.social.playstation}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_playstation")}
      >
        <FontAwesomeIcon icon={faPlaystation} />
      </a>
      <a
        href={main.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_instagram")}
      >
        <FontAwesomeIcon icon={faInstagram} />
      </a>
      <a
        href={main.social.x}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_x")}
      >
        <FontAwesomeIcon icon={faXTwitter} />
      </a>
      <a
        href={main.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_facebook")}
      >
        <FontAwesomeIcon icon={faFacebook} />
      </a>
      <a
        href={main.social.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_spotify")}
      >
        <FontAwesomeIcon icon={faSpotify} />
      </a>
      <button
        type="button"
        className={`${iconBtn} ${linkHover} ${discordCopied ? (isDark ? "!text-[#00FF41]" : "!text-[#14532d]") : ""}`}
        aria-label={t("aria_discord")}
        title={`Discord: ${main.social.discord}`}
        onClick={() => void copyDiscord()}
      >
        <FontAwesomeIcon icon={faDiscord} />
      </button>
      <span className="sr-only" aria-live="polite">
        {discordCopied ? t("social_discord_copied") : ""}
      </span>
      <a
        href={`mailto:${main.social.email}`}
        className={linkHover}
        aria-label={t("aria_email")}
      >
        <FontAwesomeIcon icon={faEnvelope} />
      </a>
      <a
        href={`tel:${main.social.phone_tel}`}
        className={linkHover}
        aria-label={t("aria_phone")}
        title={main.social.phone}
      >
        <FontAwesomeIcon icon={faPhone} />
      </a>
      <a
        href={main.social.whatsapp_url}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_whatsapp")}
        title="WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </a>
      <a
        href={main.social.location_maps_url}
        target="_blank"
        rel="noopener noreferrer"
        className={linkHover}
        aria-label={t("aria_location")}
        title={main.social.location_label}
      >
        <FontAwesomeIcon icon={faLocationDot} />
      </a>
    </div>
  );
}
