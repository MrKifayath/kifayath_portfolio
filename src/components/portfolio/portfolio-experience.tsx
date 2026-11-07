"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import { portfolioData, type PortfolioSectionId } from "@/src/data/portfolio";
import {
  calculateImpulse,
  calculateTargetIndex,
  calculateTrackOffset,
  clampProgress,
} from "@/src/lib/navigation-math";
import { CareerExperienceSection, SelectedWorkSection } from "@/src/components/portfolio/career-section";
import { ContactSection } from "@/src/components/portfolio/contact-section";
import { LandingSection } from "@/src/components/portfolio/landing-section";
import { PortfolioChrome } from "@/src/components/portfolio/portfolio-chrome";

export function PortfolioExperience() {
  const reducedMotion = useReducedMotion() === true;
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  const activeIndexRef = useRef(0);
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const sectionCount = portfolioData.panels.length;

  const updateTrackCSS = useCallback(
    (position: number) => {
      const root = rootRef.current;
      if (!root) return;
      const viewportWidth = window.innerWidth || 1440;
      const maxPosition = Math.max(viewportWidth * (sectionCount - 1), 1);
      const progress = clampProgress(position, maxPosition);
      root.style.setProperty("--track-progress", String(progress));
      root.style.setProperty("--grid-parallax", `${-progress * 16}px`);
    },
    [sectionCount],
  );

  const updateActiveIndex = useCallback(
    (requestedIndex: number) => {
      const nextIndex = Math.max(0, Math.min(sectionCount - 1, requestedIndex));
      if (activeIndexRef.current !== nextIndex) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    },
    [sectionCount],
  );

  const animateTrack = useCallback(() => {
    if (animationFrameRef.current !== null) return;

    const step = () => {
      const distance = targetXRef.current - currentXRef.current;
      // High-precision smooth easing
      const nextX = currentXRef.current + distance * 0.10;
      currentXRef.current = nextX;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-nextX}px, 0, 0)`;
      }
      updateTrackCSS(nextX);

      const viewportWidth = window.innerWidth || 1440;
      updateActiveIndex(calculateTargetIndex(nextX, viewportWidth, sectionCount));

      if (Math.abs(targetXRef.current - nextX) < 0.5) {
        currentXRef.current = targetXRef.current;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-targetXRef.current}px, 0, 0)`;
        }
        updateTrackCSS(targetXRef.current);
        updateActiveIndex(calculateTargetIndex(targetXRef.current, viewportWidth, sectionCount));
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(step);
    };

    animationFrameRef.current = window.requestAnimationFrame(step);
  }, [sectionCount, updateActiveIndex, updateTrackCSS]);

  const goToSection = useCallback(
    (requestedIndex: number, focusHeading = false) => {
      const index = Math.max(0, Math.min(sectionCount - 1, requestedIndex));
      const viewportWidth = window.innerWidth || 1440;
      const nextX = calculateTrackOffset(index, viewportWidth);

      targetXRef.current = nextX;

      if (reducedMotion) {
        if (animationFrameRef.current !== null) {
          window.cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        currentXRef.current = nextX;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-nextX}px, 0, 0)`;
        }
        updateTrackCSS(nextX);
        updateActiveIndex(index);
      } else {
        animateTrack();
      }

      if (focusHeading) {
        window.requestAnimationFrame(() => {
          sectionRefs.current[index]
            ?.querySelector<HTMLElement>("[data-section-heading]")
            ?.focus({ preventScroll: true });
        });
      }
    },
    [animateTrack, reducedMotion, sectionCount, updateActiveIndex, updateTrackCSS],
  );

  // Set dark theme on mount
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);

  // Cleanup RAF and timers
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, []);

  // Handle Window Resize
  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth || 1440;
      const offset = activeIndexRef.current * viewportWidth;
      currentXRef.current = offset;
      targetXRef.current = offset;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      updateTrackCSS(offset);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateTrackCSS]);

  // Horizontal Wheel Navigation: any scroll (deltaY or deltaX) translates the horizontal track
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleWheel = (event: WheelEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      // Allow native vertical scrolling if user is interacting with an open dialog or native inputs
      if (target?.closest("dialog[open], input, textarea, select")) return;

      const dominantDelta =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominantDelta) < 1.5) return;

      const panelScroller = target?.closest<HTMLElement>("[data-panel-scroll]");
      if (panelScroller && Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
        const maxScroll = panelScroller.scrollHeight - panelScroller.clientHeight;
        const atTop = panelScroller.scrollTop <= 0;
        const atBottom = panelScroller.scrollTop >= maxScroll - 1;
        if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) {
          event.preventDefault();
          panelScroller.scrollTop += event.deltaY;
          return;
        }
      }

      // Prevent native vertical scroll bounce
      event.preventDefault();

      const viewportWidth = window.innerWidth || 1440;
      const maxX = (sectionCount - 1) * viewportWidth;

      const impulse = calculateImpulse(dominantDelta, viewportWidth, event.deltaMode === 0);
      const unboundedTarget = targetXRef.current + impulse;
      const maxJump = viewportWidth * 1.15;
      targetXRef.current = Math.max(
        0,
        Math.min(
          maxX,
          Math.max(currentXRef.current - maxJump, Math.min(currentXRef.current + maxJump, unboundedTarget)),
        ),
      );

      animateTrack();

      // Snap to nearest section once wheel settles
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(() => {
        const snappedIndex = calculateTargetIndex(targetXRef.current, viewportWidth, sectionCount);
        targetXRef.current = snappedIndex * viewportWidth;
        animateTrack();
      }, 180);
    };

    root.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", handleWheel);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, [animateTrack, sectionCount]);

  // Touch Swipe Support for mobile and touchscreens
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
      isDraggingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || touchStartXRef.current === null) return;
      const touch = e.touches[0];
      if (!touch) return;

      const diffX = touchStartXRef.current - touch.clientX;
      const diffY = touchStartYRef.current !== null ? touchStartYRef.current - touch.clientY : 0;

      // If user is swiping horizontally, prevent native scroll
      if (Math.abs(diffX) > Math.abs(diffY)) {
        e.preventDefault();
        const viewportWidth = window.innerWidth || 1440;
        const maxX = (sectionCount - 1) * viewportWidth;
        targetXRef.current = Math.max(0, Math.min(maxX, currentXRef.current + diffX * 0.8));
        animateTrack();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current || touchStartXRef.current === null) return;
      isDraggingRef.current = false;
      const touch = e.changedTouches[0];
      if (touch) {
        const diffX = touchStartXRef.current - touch.clientX;
        const viewportWidth = window.innerWidth || 1440;
        if (Math.abs(diffX) > 60) {
          const step = diffX > 0 ? 1 : -1;
          goToSection(activeIndexRef.current + step);
        } else {
          goToSection(activeIndexRef.current);
        }
      }
      touchStartXRef.current = null;
      touchStartYRef.current = null;
    };

    root.addEventListener("touchstart", handleTouchStart, { passive: true });
    root.addEventListener("touchmove", handleTouchMove, { passive: false });
    root.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      root.removeEventListener("touchstart", handleTouchStart);
      root.removeEventListener("touchmove", handleTouchMove);
      root.removeEventListener("touchend", handleTouchEnd);
    };
  }, [animateTrack, goToSection, sectionCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (
        event.isComposing ||
        target?.closest("input, textarea, select, [contenteditable='true'], dialog[open]")
      ) {
        return;
      }

      let nextIndex: number | null = null;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        nextIndex = activeIndexRef.current + 1;
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        nextIndex = activeIndexRef.current - 1;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = sectionCount - 1;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      goToSection(nextIndex, true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToSection, sectionCount]);



  function handleSectionFocus(event: FocusEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const section = target.closest<HTMLElement>("[data-section-index]");
    const sectionIndex = Number(section?.dataset.sectionIndex);
    if (Number.isFinite(sectionIndex) && sectionIndex !== activeIndexRef.current) {
      goToSection(sectionIndex);
    }
  }

  function renderSection(sectionId: PortfolioSectionId, index: number) {
    const active = index === activeIndex;

    if (sectionId === "landing") {
      return (
        <LandingSection
          active={active}
          horizontalNavigation={true}
          onNavigate={goToSection}
        />
      );
    }

    if (sectionId === "career-experience") {
      return <CareerExperienceSection active={active} />;
    }

    if (sectionId === "selected-work") {
      return <SelectedWorkSection active={active} />;
    }

    return <ContactSection active={active} />;
  }

  return (
    <main
      className="portfolio-root"
      ref={rootRef}
    >
      <PortfolioChrome
        activePanelIndex={activeIndex}
        onNavigate={goToSection}
        reducedMotion={reducedMotion}
      />

      <div
        aria-label={portfolioData.controls.portfolioContent}
        className="portfolio-viewport"
        id="portfolio-viewport"
        onFocusCapture={handleSectionFocus}
        ref={viewportRef}
        role="region"
        tabIndex={-1}
      >
        <div className="portfolio-track" ref={trackRef}>
          {portfolioData.panels.map((panel, index) => (
            <section
              aria-labelledby={`${panel.id}-title`}
              className={`portfolio-section portfolio-section--${panel.id}`}
              data-section-id={panel.id}
              data-section-index={index}
              id={panel.id}
              key={panel.id}
              ref={(element) => {
                sectionRefs.current[index] = element;
              }}
            >
              {renderSection(panel.id, index)}
            </section>
          ))}
        </div>
      </div>
      <nav className="section-arrow-rail" aria-label="Section navigation">
        {activeIndex > 0 ? (
          <button aria-label={portfolioData.controls.previousSection} className="section-arrow-button section-arrow-button--previous" onClick={() => goToSection(activeIndex - 1)} type="button">
            <ArrowLeft aria-hidden="true" />
          </button>
        ) : null}
        {activeIndex < sectionCount - 1 ? (
          <button aria-label={portfolioData.controls.nextSection} className="section-arrow-button section-arrow-button--next" onClick={() => goToSection(activeIndex + 1)} type="button">
            <ArrowRight aria-hidden="true" />
          </button>
        ) : null}
      </nav>
    </main>
  );
}
