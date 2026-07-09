import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { AuditReadiness } from "./sections/AuditReadiness";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { PilotEligibilityCard } from "./components/PilotEligibilityCard";
import { ProjectStatus } from "./sections/ProjectStatus";
import { Transparency } from "./sections/Transparency";
import { copy, defaultLocale, locales, type Locale } from "./data/i18n";
import "./styles/site.css";

const HeroScene = lazy(() => import("./scenes/HeroScene"));

function useShouldRender3D() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewportQuery = window.matchMedia("(min-width: 721px)");
    const update = () => setShouldRender(viewportQuery.matches && !motionQuery.matches);
    update();
    motionQuery.addEventListener("change", update);
    viewportQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      viewportQuery.removeEventListener("change", update);
    };
  }, []);

  return shouldRender;
}

function App() {
  const shouldRender3D = useShouldRender3D();
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <React.StrictMode>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="site-shell">
        <header className="top-nav" aria-label={t.navAria}>
          <a className="wordmark" href="/" aria-label={t.homeAria}>
            <span className="wordmark-dot" aria-hidden="true" />
            <span>TikiDeco</span>
          </a>
          <div className="nav-cluster">
            <nav aria-label={t.sectionsAria}>
              <a href="#main">{t.nav.overview}</a>
              <a href="#status">{t.nav.status}</a>
              <a href="/pilot/">{t.nav.pilot}</a>
              <a href="#audit">{t.nav.audit}</a>
              <a href="https://github.com/denterion/Token-TIkiDeco/issues" target="_blank" rel="noopener noreferrer">
                {t.nav.feedback}
              </a>
            </nav>
            <div className="language-switcher" aria-label={t.language}>
              {locales.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  aria-label={item.aria}
                  aria-pressed={locale === item.code}
                  className={locale === item.code ? "active" : ""}
                  onClick={() => setLocale(item.code)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>
        <main id="main">
          <section className="hero-wrap" aria-label="TikiDeco overview">
            <div className="scene-layer" aria-hidden="true">
              {shouldRender3D ? (
                <Suspense fallback={<div className="scene-fallback" />}>
                  <HeroScene />
                </Suspense>
              ) : (
                <div className="scene-fallback" />
              )}
            </div>
            <Hero copy={t.hero} />
          </section>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <ProjectStatus copy={t.status} rows={t.statusRows} />
            <PilotEligibilityCard />
            <Transparency copy={t.transparency} />
            <AuditReadiness copy={t.audit} />
          </motion.div>
        </main>
        <Footer copy={t.footer} />
      </div>
    </React.StrictMode>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
