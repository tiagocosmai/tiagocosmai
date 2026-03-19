import { createContext, useContext, type ReactNode } from "react";

export type ThemeMode = "dark" | "light";

const ThemeContext = createContext<ThemeMode>("dark");

export function ThemeProvider({
  mode,
  children,
}: {
  mode: ThemeMode;
  children: ReactNode;
}) {
  return (
    <ThemeContext.Provider value={mode}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
