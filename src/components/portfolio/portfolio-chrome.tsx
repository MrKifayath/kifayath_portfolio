"use client";

import { ArrowUpRight } from "lucide-react";
import { portfolioData } from "@/src/data/portfolio";

type PortfolioChromeProps = {
  activePanelIndex: number;
  reducedMotion: boolean;
  onNavigate: (index: number) => void;
};

export function PortfolioChrome({
  activePanelIndex,
  reducedMotion,
  onNavigate,
}: PortfolioChromeProps) {
  const controls = portfolioData.controls;

  // Header Nav Items cleanly routing to Experience, Projects, Skills
  const navItems = [
    { label: "EXPERIENCE", targetIndex: 1 },
    { label: "PROJECTS", targetIndex: 2 },
    { label: "SKILLS", targetIndex: 3 },
  ];

  return (
    <header className="site-header">
      {/* 1. Left Brand Identity */}
      <div className="site-header__identity">
        <button
          aria-label={controls.returnToLanding}
          className="brand-logo-btn"
          onClick={() => onNavigate(0)}
          type="button"
        >
          {/* Geometric Stylized Lime 'K' Mark */}
          <span className="brand-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path
                d="M4 3H8V21H4V3Z"
                fill="currentColor"
              />
              <path
                d="M8 12.5L16.5 3H21.5L12.5 12.5L22 21H16.8L8 12.5Z"
                fill="currentColor"
              />
            </svg>
          </span>

          <span className="brand-divider" aria-hidden="true">|</span>

          <span className="brand-name font-sans font-bold tracking-wider">
            MD. KIFAYATULLAH
          </span>

          <span className="brand-subdivider" aria-hidden="true">/</span>

          <span className="brand-role font-mono text-xs tracking-wider">
            FULL-STACK ENGINEER
          </span>
        </button>
      </div>

      {/* 2. Right Navigation & Actions */}
      <div className="site-header__right">
        <nav className="site-header__nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = activePanelIndex === item.targetIndex;
            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={`nav-tab-btn ${isActive ? "is-active" : ""}`}
                key={item.label}
                onClick={() => onNavigate(item.targetIndex)}
                type="button"
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Primary Contact CTA Button */}
        <button
          className="nav-contact-cta"
          onClick={() => onNavigate(4)}
          type="button"
        >
          <span>CONTACT</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
