"use client";

import { useState } from "react";
import { ArrowUpRight, Download, MapPin, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "EXPERIENCE", targetIndex: 1 },
    { label: "PROJECTS", targetIndex: 2 },
  ];

  const allSections = [
    { label: "01 · Overview (Home)", index: 0 },
    { label: "02 · Work Experience", index: 1 },
    { label: "03 · Selected Projects", index: 2 },
    { label: "04 · Contact", index: 3 },
  ];

  function handleMobileNav(index: number) {
    onNavigate(index);
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="site-header">
        {/* 1. Left Brand Identity */}
        <div className="site-header__identity">
          <button
            aria-label={controls.returnToLanding}
            className="brand-logo-btn"
            onClick={() => handleMobileNav(0)}
            type="button"
          >
            {/* Geometric Stylized Lime 'K' Mark */}
            <span className="brand-logo-mark shrink-0" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M4 3H8V21H4V3Z" fill="currentColor" />
                <path d="M8 12.5L16.5 3H21.5L12.5 12.5L22 21H16.8L8 12.5Z" fill="currentColor" />
              </svg>
            </span>

            <span className="brand-divider hidden sm:inline" aria-hidden="true">|</span>

            {/* Desktop Full Name */}
            <span className="brand-name font-sans font-bold tracking-wider hidden sm:inline">
              KIFAYATULLAH MOHAMMAD
            </span>

            {/* Mobile Compact Name */}
            <span className="brand-name font-sans font-bold tracking-wider sm:hidden text-xs">
              K. MOHAMMAD
            </span>

            <span className="brand-subdivider hidden lg:inline" aria-hidden="true">/</span>

            <span className="brand-role font-mono text-xs tracking-wider hidden lg:inline">
              FULL-STACK ENGINEER
            </span>
          </button>
        </div>

        {/* 2. Right Navigation & Actions */}
        <div className="site-header__right">
          {/* Section Counter indicator */}
          <div
            aria-label={`Panel ${activePanelIndex + 1} of 4`}
            className="header-panel-counter font-mono text-xs inline-flex items-center gap-1"
          >
            <span className="text-accent font-semibold">0{activePanelIndex + 1}</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-muted-foreground">04</span>
          </div>

          {/* Desktop Navigation Tabs (>= 768px) */}
          <nav className="site-header__nav hidden md:flex" aria-label="Main Navigation">
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
            className="nav-contact-cta hidden sm:inline-flex"
            onClick={() => onNavigate(4)}
            type="button"
          >
            <span>CONTACT</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          </button>

          {/* Mobile Menu Trigger (< 768px) */}
          <button
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="mobile-menu-btn md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-accent stroke-[2.5]" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 text-foreground stroke-[2.2]" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Glass Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-backdrop md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <div className="mobile-nav-header">
              <span className="font-mono text-xs tracking-wider text-accent font-semibold">
                NAVIGATION
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                PANEL 0{activePanelIndex + 1} / 04
              </span>
            </div>

            <nav className="mobile-nav-links">
              {allSections.map((item) => {
                const isActive = activePanelIndex === item.index;
                return (
                  <button
                    className={`mobile-nav-link ${isActive ? "is-active" : ""}`}
                    key={item.label}
                    onClick={() => handleMobileNav(item.index)}
                    type="button"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? "text-accent translate-x-0.5" : "text-muted-foreground/60"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </nav>

            <div className="mobile-nav-footer">
              <a
                className="mobile-resume-link"
                download="Kifayatullah_Mohammad_Resume.pdf"
                href="/resume.pdf"
                onClick={() => setMobileMenuOpen(false)}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="w-4 h-4 text-accent" aria-hidden="true" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>

              <div className="mobile-location-row font-mono text-[11px] text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                <span>BENGALURU, INDIA · OPEN TO WORK</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
