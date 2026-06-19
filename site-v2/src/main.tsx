import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { Architecture } from "./sections/Architecture";
import { AuditReadiness } from "./sections/AuditReadiness";
import { BeachTech } from "./sections/BeachTech";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { ProjectStatus } from "./sections/ProjectStatus";
import { Transparency } from "./sections/Transparency";
import "./styles/site.css";

const HeroScene = lazy(() => import("./scenes/HeroScene"));

function App() {
  return (
    <React.StrictMode>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-shell">
        <header className="top-nav" aria-label="Primary navigation">
          <a className="wordmark" href="/" aria-label="TikiDeco home">
            <span className="wordmark-dot" aria-hidden="true" />
            <span>TikiDeco</span>
          </a>
          <nav aria-label="Page sections">
            <a href="#status">Status</a>
            <a href="#transparency">Transparency</a>
            <a href="#audit">Audit readiness</a>
            <a href="/verify/">Verify</a>
          </nav>
        </header>
        <main id="main">
          <section className="hero-wrap" aria-label="TikiDeco overview">
            <div className="scene-layer" aria-hidden="true">
              <Suspense fallback={<div className="scene-fallback" />}>
                <HeroScene />
              </Suspense>
            </div>
            <Hero />
          </section>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <ProjectStatus />
            <Transparency />
            <Architecture />
            <AuditReadiness />
            <BeachTech />
          </motion.div>
        </main>
        <Footer />
      </div>
    </React.StrictMode>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
