import React, { Suspense, lazy, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { AuditReadiness } from "./sections/AuditReadiness";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { PilotEligibilityCard } from "./components/PilotEligibilityCard";
import { CampaignLifecycle } from "./components/CampaignLifecycle";
import { PreviewFeedbackPanel } from "./components/PreviewFeedbackPanel";
import { ProjectStatus } from "./sections/ProjectStatus";
import { Transparency } from "./sections/Transparency";
import { OneMinuteBrief } from "./sections/OneMinuteBrief";
import { siteCopy } from "./data/i18n";
import "./styles/site.css";
import { previewMetrics } from "./lib/previewMetrics";

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
  const [navOpen, setNavOpen] = useState(false);
  const t = siteCopy;
  const pilotRoute = window.location.pathname.startsWith("/pilot");

  useEffect(() => {
    previewMetrics.recordPageSession();
  }, []);

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
          <button
            className="nav-toggle"
            type="button"
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
          <nav id="primary-nav" aria-label={t.sectionsAria} data-open={navOpen} onClick={() => setNavOpen(false)}>
            <a href="/trust/">{t.nav.trust}</a>
            <a href="/#status">{t.nav.status}</a>
            <a href="/pilot/">{t.nav.pilot}</a>
            <a href="/#audit">{t.nav.audit}</a>
            <a href="https://github.com/denterion/Token-TIkiDeco/issues" target="_blank" rel="noopener noreferrer">
              {t.nav.feedback}
            </a>
          </nav>
        </header>
        <main id="main" className={pilotRoute ? "pilot-route" : undefined}>
          {!pilotRoute ? <section className="hero-wrap" aria-label="TikiDeco overview">
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
          </section> : null}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {!pilotRoute ? <OneMinuteBrief copy={t.brief} /> : null}
            {!pilotRoute ? <ProjectStatus copy={t.status} rows={t.statusRows} /> : null}
            {pilotRoute ? <PilotEligibilityCard /> : null}
            {pilotRoute ? <CampaignLifecycle /> : null}
            {pilotRoute ? <PreviewFeedbackPanel /> : null}
            {!pilotRoute ? <Transparency copy={t.transparency} /> : null}
            {!pilotRoute ? <AuditReadiness copy={t.audit} /> : null}
          </motion.div>
        </main>
        <Footer copy={t.footer} />
      </div>
    </React.StrictMode>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
