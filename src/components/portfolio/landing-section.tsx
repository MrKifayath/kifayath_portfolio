"use client";

import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react";
import { portfolioData } from "@/src/data/portfolio";
import { PanelReveal } from "@/src/components/portfolio/panel-reveal";

type LandingSectionProps = {
  active: boolean;
  horizontalNavigation: boolean;
  onNavigate: (index: number) => void;
};

export function LandingSection({ active, onNavigate }: LandingSectionProps) {
  const landing = portfolioData.landing;

  return (
    <div className="landing-stage" data-panel-scroll>
      {/* 1. Moody Neon Green Coding Wallpaper Background */}
      <div className="landing-wallpaper-wrap" aria-hidden="true">
        <Image
          src="/assets/aistudio/Moody_Neon_Green_Coding_Wallpaper_2a4f3c41.png"
          alt="Moody neon green coding background"
          fill
          priority
          className="object-cover object-center pointer-events-none select-none"
          referrerPolicy="no-referrer"
        />
        {/* Soft atmospheric overlay */}
        <div className="landing-wallpaper-overlay" />
      </div>

      {/* 2. Center Hero Content with Uneven Black Faded Shield */}
      <PanelReveal active={active} className="hero-center-content">
        <div className="hero-text-wrap">
          {/* Organic uneven dark faded shield behind the text */}
          <div className="hero-text-backdrop" aria-hidden="true" />

          <h1 className="hero-main-title panel-reveal__item reveal-step-1">
            <span className="block">{landing.headlineLine1}</span>
            <span className="block mt-1 sm:mt-2">
              {landing.headlineLine2}{" "}
              <em className="hero-accent-text">{landing.headlineAccent}</em>
            </span>
          </h1>

          <p className="hero-description panel-reveal__item reveal-step-2">
            SDE-1 with a mechanical engineering background. I&apos;ve shipped dashboards,
            APIs and an invoicing platform for 30+ merchants, using{" "}
            <span className="hero-subtext-highlight">Next.js</span>, NestJS, PostgreSQL and AWS.
          </p>

          <div className="hero-cta-group panel-reveal__item reveal-step-3">
            <button
              className="hero-btn-primary"
              onClick={() => onNavigate(2)}
              type="button"
            >
              <span>{landing.primaryAction}</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5 stroke-[2.5]" aria-hidden="true" />
            </button>

            <button
              className="hero-btn-secondary"
              onClick={() => onNavigate(1)}
              type="button"
            >
              <span>{landing.secondaryAction}</span>
            </button>
          </div>
        </div>
      </PanelReveal>

      {/* 3. Bottom Status Ticker Bar (Strictly 3 equal columns, center is 50% dead center) */}
      <div className="landing-bottom-ticker" aria-label="Credentials & Availability">
        <div className="ticker-cell ticker-cell--left">
          <Layers className="w-4 h-4 text-accent/80 shrink-0" aria-hidden="true" />
          <span className="ticker-text font-mono">{landing.ticker.experience}</span>
        </div>

        <div className="ticker-cell ticker-cell--center">
          <span className="ticker-text font-mono">{landing.ticker.stack}</span>
        </div>

        <div className="ticker-cell ticker-cell--right">
          <span className="pulse-dot" aria-hidden="true" />
          <span className="ticker-text font-mono text-foreground font-semibold">
            {landing.ticker.status}
          </span>
        </div>
      </div>
    </div>
  );
}
