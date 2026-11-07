"use client";

import Image from "next/image";
import { ArrowUpRight, Download, MapPin } from "lucide-react";
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

          {/* Headline breaking cleanly into two even lines:
              Line 1: "I build full-stack products"
              Line 2: "that work end to end." */}
          <h1 className="hero-main-title panel-reveal__item reveal-step-1">
            <span className="hero-headline-line hero-headline-line--1">
              {landing.headlineLine1}
            </span>
            <span className="hero-headline-line hero-headline-line--2">
              {landing.headlineLine2}{" "}
              <em className="hero-accent-text">{landing.headlineAccent}</em>
            </span>
          </h1>

          {/* Subheading: clean, no link underline on Next.js */}
          <p className="hero-description panel-reveal__item reveal-step-2">
            {landing.intro}
          </p>

          <div className="hero-availability panel-reveal__item reveal-step-3">
            <span className="hero-availability__tag">
              <span className="hero-availability__dot" aria-hidden="true" />
              Available now for Freelance
            </span>
            {/* <p className="hero-availability__copy">
              Landing pages, admin dashboards, payment integrations, and bug-fix sprints.
            </p> */}
          </div>

          {/* CTA Buttons: View Projects, My Experience, and consistent Download Resume button */}
          <div className="hero-cta-group panel-reveal__item reveal-step-4">
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

            <a
              className="hero-btn-secondary hero-btn-resume"
              download="Kifayatullah_Mohammad_Resume.pdf"
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <Download className="w-4 h-4 mr-1.5 stroke-[2.2] text-accent" aria-hidden="true" />
              <span>{landing.resumeAction}</span>
            </a>
          </div>
        </div>
      </PanelReveal>

      {/* Minimalist Bottom Scroll Cue */}
      <div className="landing-bottom-cue">
        <button
          className="minimal-scroll-cue"
          onClick={() => onNavigate(1)}
          type="button"
          aria-label="Scroll to next section: Experience"
        >
          <span className="minimal-scroll-cue__label">SCROLL</span>
          <span className="minimal-scroll-cue__arrow" aria-hidden="true">→</span>
        </button>
      </div>

      {/* 3. Bottom Status Ribbon: Left = Bengaluru, India | Center = Empty | Right = OPEN TO WORK */}
      <div className="landing-bottom-ticker" aria-label="Location & Availability">
        <div className="ticker-cell ticker-cell--left">
          <MapPin className="w-4 h-4 text-accent/90 shrink-0" aria-hidden="true" />
          <span className="ticker-text font-mono font-medium tracking-wider">
            {landing.ticker.location}
          </span>
        </div>

        <div className="ticker-cell ticker-cell--center" aria-hidden="true">
          {/* Empty center as requested */}
        </div>

        <div className="ticker-cell ticker-cell--right">
          <span className="pulse-dot" aria-hidden="true" />
          <span className="ticker-text font-mono text-foreground font-semibold tracking-wider">
            {landing.ticker.status}
          </span>
        </div>
      </div>
    </div>
  );
}
