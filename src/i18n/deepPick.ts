import type { Locale } from "../types/locale";
import { isTri } from "../types/locale";

function isTriStringArray(v: unknown): v is Record<Locale, string[]> {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    Array.isArray(o.pt) &&
    Array.isArray(o.en) &&
    Array.isArray(o.es) &&
    o.pt.every((x) => typeof x === "string")
  );
}

/** Converte estruturas com campos { pt, en, es } no texto do idioma atual. */
export function deepPick<T>(value: T, locale: Locale): T {
  if (isTri(value)) {
    const s = value[locale] ?? value.en;
    return s as T;
  }
  if (isTriStringArray(value)) {
    const arr = value[locale] ?? value.en;
    return arr as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepPick(item, locale)) as T;
  }
  if (value !== null && typeof value === "object") {
    const out = {} as Record<string, unknown>;
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepPick(v, locale);
    }
    return out as T;
  }
  return value;
}
