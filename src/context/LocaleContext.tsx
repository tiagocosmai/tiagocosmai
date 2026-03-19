import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import rawContent from "../data/content.json";
import rawResources from "../data/resources.json";
import { deepPick } from "../i18n/deepPick";
import type { PickedContent } from "../types/content";
import { type Locale, type Tri } from "../types/locale";

const STORAGE_KEY = "portfolio-locale";

const resources = rawResources as Record<string, Tri>;

function detectLocale(): Locale {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === "pt" || s === "en" || s === "es") return s;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== "undefined") {
    const n = navigator.language.toLowerCase();
    if (n.startsWith("pt")) return "pt";
    if (n.startsWith("es")) return "es";
  }
  return "en";
}

function htmlLang(locale: Locale): string {
  if (locale === "pt") return "pt-BR";
  if (locale === "es") return "es";
  return "en";
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  c: PickedContent;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = htmlLang(l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
  }, [locale]);

  const t = useCallback(
    (key: string) => {
      const row = resources[key];
      if (!row) return key;
      return row[locale] ?? row.en ?? key;
    },
    [locale],
  );

  const c = useMemo(
    () => deepPick(rawContent, locale) as unknown as PickedContent,
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, c }),
    [locale, setLocale, t, c],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
