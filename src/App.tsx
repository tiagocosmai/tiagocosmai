import { useEffect, useState } from "react";
import {
  Main,
  Timeline,
  Expertise,
  Certifications,
  Education,
  Languages,
  Hobbies,
  Project,
  PersonalProjects,
  Courses,
  Contact,
  Navigation,
  Footer,
} from "./components";
import FadeIn from "./components/FadeIn";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider, type ThemeMode } from "./context/ThemeContext";
import { LocaleProvider } from "./context/LocaleContext";
import { SHOW_CONTACT } from "./config/features";

function App() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const handleModeChange = () => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.title = "Portifólio - Tiago Cosmai";
  }, []);

  const isDark = mode === "dark";

  return (
    <ThemeProvider mode={mode}>
      <LocaleProvider>
      <div
        className={`relative min-h-screen font-sans transition-colors duration-300 ${
          isDark
            ? "bg-[#030806] text-white"
            : "bg-[#f0fdf7] text-[#0d1116]"
        }`}
      >
        <Navigation mode={mode} modeChange={handleModeChange} />
        <FadeIn transitionDuration={700}>
          <Main />
          <Expertise />
          <Certifications />
          <Timeline />
          <Education />
          <Languages />
          <Project />
          <PersonalProjects />
          <Courses />
          <Hobbies />
          {SHOW_CONTACT ? <Contact /> : null}
        </FadeIn>
        <Footer />
        <ScrollToTop />
      </div>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
