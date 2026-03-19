import type { FC } from "react";
import type { Locale } from "../types/locale";

export type FlagProps = { className?: string };

export const BRFlag = ({ className = "h-6 w-6 shrink-0" }: FlagProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className={className}
    aria-hidden
  >
    <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#459a45" />
    <path
      d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
      opacity=".15"
    />
    <path
      d="M3.472,16l12.528,8,12.528-8-12.528-8L3.472,16Z"
      fill="#fedf00"
    />
    <circle cx="16" cy="16" r="5" fill="#0a2172" />
    <path
      d="M14,14.5c-.997,0-1.958,.149-2.873,.409-.078,.35-.126,.71-.127,1.083,.944-.315,1.951-.493,2.999-.493,2.524,0,4.816,.996,6.519,2.608,.152-.326,.276-.666,.356-1.026-1.844-1.604-4.245-2.583-6.875-2.583Z"
      fill="#fff"
    />
    <path
      d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
      fill="#fff"
      opacity=".2"
    />
  </svg>
);

/** 13 listras; cantão = 7 listras de altura (não cobre as listras inferiores à esquerda). */
export const USFlag = ({ className = "h-6 w-6 shrink-0" }: FlagProps) => {
  const top = 4;
  const stripeH = 24 / 13;
  const cantonW = 14;
  const cantonRight = 1 + cantonW;
  const cantonH = 7 * stripeH;
  const cantonBottom = top + cantonH;
  let whitePaths = "";
  for (let i = 1; i < 13; i += 2) {
    const y = top + i * stripeH;
    const y2 = y + stripeH;
    if (y >= cantonBottom - 0.01) {
      whitePaths += `M1 ${y}h30V${y2}H1z`;
    } else {
      whitePaths += `M${cantonRight} ${y}h${32 - cantonRight - 1}V${y2}H${cantonRight}z`;
    }
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden
    >
      <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#b22234" />
      <path d={whitePaths} fill="#fff" />
      <rect
        x="1"
        y="4"
        width={cantonW}
        height={cantonH}
        rx="2"
        ry="2"
        fill="#3c3b6e"
      />
      <g fill="#fff" opacity="0.92">
        <circle cx="4.5" cy="6.3" r="0.5" />
        <circle cx="7" cy="6.3" r="0.5" />
        <circle cx="9.5" cy="6.3" r="0.5" />
        <circle cx="12" cy="6.3" r="0.5" />
        <circle cx="5.75" cy="8.1" r="0.5" />
        <circle cx="8.25" cy="8.1" r="0.5" />
        <circle cx="10.75" cy="8.1" r="0.5" />
        <circle cx="4.5" cy="9.9" r="0.5" />
        <circle cx="7" cy="9.9" r="0.5" />
        <circle cx="9.5" cy="9.9" r="0.5" />
        <circle cx="12" cy="9.9" r="0.5" />
        <circle cx="5.75" cy="11.7" r="0.5" />
        <circle cx="8.25" cy="11.7" r="0.5" />
        <circle cx="10.75" cy="11.7" r="0.5" />
      </g>
      <path
        d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Z"
        fill="none"
        opacity=".12"
      />
    </svg>
  );
};

export const ESFlag = ({ className = "h-6 w-6 shrink-0" }: FlagProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className={className}
    aria-hidden
  >
    <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c60b1e" />
    <rect x="1" y="11" width="30" height="10" fill="#ffc400" />
    <path
      d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
      opacity=".15"
    />
  </svg>
);

/** Opções de idioma para o seletor (bandeira SVG + código). */
export const LANGUAGE_OPTIONS: {
  value: Locale;
  label: string;
  Flag: FC<FlagProps>;
}[] = [
  { value: "pt", label: "PT", Flag: BRFlag },
  { value: "en", label: "EN", Flag: USFlag },
  { value: "es", label: "ES", Flag: ESFlag },
];

export function LocaleFlag({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const opt = LANGUAGE_OPTIONS.find((o) => o.value === locale);
  if (!opt) return null;
  const { Flag } = opt;
  return <Flag className={className} />;
}
