"use client";

import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowDown, ArrowUpRight, AudioLines, Clapperboard, Mail, Scissors, Volume2, VolumeX, X } from "lucide-react";

/**
 * Where the "Contact me by email" button goes. This is the contact panel of the main portfolio.
 * Change this one line if your contact page lives at a different route.
 */
const CONTACT_HREF = "/#contact";

/** Shared timing so every animation on the page is choreographed from the same clock. */
const EASE_OUT = [0.22, 1, 0.36, 1] as const; // soft deceleration for reveals
const EASE_PANEL = [0.32, 0.72, 0, 1] as const; // confident, slightly heavier curve for the modal
const INTRO_MS = 900; // curtain stays up exactly as long as its progress bar takes to fill
const CURTAIN_S = 0.7; // curtain lift duration

/**
 * Hover choreography for the "See my work in detail" card. These are small, slow, eased grows
 * (not springs) so the motion is clearly visible but never loud. Children pick up the parent's
 * "hover" label automatically, so everything moves together from a single hover.
 */
const ctaGrow = { duration: 0.85, ease: [0.45, 0, 0.2, 1] as const };
const ctaButtonVariants = {
  hover: { y: -3, scale: 1.012 },
  tap: { y: -1, scale: 0.99 },
};
const ctaTitleVariants = { hover: { scale: 1.03 } };
const ctaSubtitleVariants = { hover: { x: 2, scale: 1.015 } };
const ctaEyebrowVariants = { hover: { x: 2 } };
const ctaDotVariants = { hover: { scale: 1.3 } };
const ctaCardVariants = [
  { hover: { x: -6, y: -3, rotate: -3, scale: 1.03, transition: { ...ctaGrow, delay: 0 } } },
  { hover: { y: -7, scale: 1.05, transition: { ...ctaGrow, delay: 0.04 } } },
  { hover: { x: 6, y: -3, rotate: 3, scale: 1.03, transition: { ...ctaGrow, delay: 0.08 } } },
] as const;

const editProjects = [
  {
    id: "hush",
    title: "HUSH Launch Edit",
    subtitle: "Edit 1",
    format: "Reel",
    duration: "1:13",
    tag: "CINEMATIC / 001",
    videoSrc: "/videos/hush%20viral.mp4",
    posterSrc: "/images/video-editing/hush.jpg",
    previewLabel: "PREVIEW / 01",
    source: "Clips from the Valorant music video, cut to Tame Impala’s “Loser”.",
    idea: "A fast-paced, girl-power style edit that builds with the song.",
    edit: "Three hours of text effects and transitions timed to the beat, with expressive effects throughout. My most viral reel on Instagram.",
    builtWith: "DaVinci Resolve",
    highlight: "84K",
    treatment: "hush",
  },
  {
    id: "sage",
    title: "Rick Grimes Edit",
    subtitle: "The Walking Dead edit",
    format: "Reel · YouTube Short",
    duration: "0:41",
    tag: "SHORT FORM / 002",
    videoSrc: "/videos/TWD RICK GRIMES.mp4",
    posterSrc: "/images/video-editing/rick.jpg",
    previewLabel: "PREVIEW / 02",
    source: "The Walking Dead, Rick Grimes.",
    idea: "A high-paced edit.",
    edit: "Punchy effects and new transitions, kept fast from start to finish.",
    builtWith: "DaVinci Resolve",
    highlight: undefined,
    treatment: "sage",
  },
  {
    id: "omen",
    title: "Vikram Vedha Edit",
    subtitle: "Movie edit",
    format: "Reel · YouTube Short",
    duration: "0:37",
    tag: "SHORT FORM / 003",
    videoSrc: "/videos/2.mp4",
    posterSrc: "/images/video-editing/omen.jpg",
    previewLabel: "PREVIEW / 03",
    source: "The movie Vikram Vedha.",
    idea: "A fast-paced edit built to keep the energy up.",
    edit: "Tight pacing and clean cuts from start to end.",
    builtWith: "DaVinci Resolve",
    highlight: undefined,
    treatment: "omen",
  },
  {
    id: "srk",
    title: "SRK Edit",
    subtitle: "King · Movie edit",
    format: "Video edit",
    duration: "1:29",
    tag: "MOVIE EDIT / 004",
    videoSrc: "/videos/SRK%20EDIT.mp4",
    posterSrc: "/images/video-editing/srk.jpg",
    previewLabel: "PREVIEW / 04",
    source: "The new movie King.",
    idea: "A mildly fast-paced edit.",
    edit: undefined,
    builtWith: "DaVinci Resolve",
    highlight: undefined,
    treatment: "srk",
  },
  {
    id: "edit-three",
    title: "HUSH Edit",
    subtitle: "Action · Girl-power style",
    format: "Video edit",
    duration: "0:33",
    tag: "VIDEO EDIT / 005",
    videoSrc: "/videos/3.mp4",
    posterSrc: "/images/video-editing/three.jpg",
    previewLabel: "PREVIEW / 05",
    source: undefined,
    idea: "A girl-power action edit built around a fast beat.",
    edit: "Several Easter eggs, expressive text effects, and energetic transitions.",
    builtWith: "DaVinci Resolve",
    highlight: undefined,
    treatment: "three",
  },
] as const;

// `custom` is the project index. The first project is already on screen when the modal opens,
// so it waits for the panel to expand before revealing; the rest reveal as they're scrolled to.
const projectEntryVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: EASE_OUT,
      delay: index === 0 ? 0.42 : 0,
      delayChildren: index === 0 ? 0.42 : 0,
      staggerChildren: 0.11,
    },
  }),
};

const projectMediaVariants = {
  hidden: { opacity: 0, x: -22, scale: 0.975 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const } },
};

const projectCopyVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.12, staggerChildren: 0.12 } },
};

const projectTextItemVariants = {
  hidden: { opacity: 0, y: 15, filter: "blur(5px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};

function PlaceholderPoster({
  treatment,
  title,
  videoSrc,
  posterSrc,
  previewLabel,
  highlight,
  allowAudio = false,
}: {
  treatment: string;
  title: string;
  videoSrc?: string;
  posterSrc?: string;
  previewLabel?: string;
  highlight?: string;
  allowAudio?: boolean;
}) {
  const posterRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterInView = useInView(posterRef, { margin: "80px" });
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    video.muted = allowAudio ? muted : true;
    video.volume = volume;
    if (posterInView) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [allowAudio, muted, posterInView, videoSrc, volume]);

  return (
    <div
      ref={posterRef}
      aria-label={`${title} video preview`}
      className={`video-editing__poster video-editing__poster--${treatment}`}
      role={allowAudio ? "group" : "img"}
    >
      <span className="video-editing__poster-kicker">
        {previewLabel ?? `FRAME STUDY · 0${editProjects.findIndex((project) => project.treatment === treatment) + 1}`}
      </span>
      {highlight ? <span className="video-editing__poster-highlight">{highlight}</span> : null}
      {videoSrc ? (
        <div aria-hidden="true" className="video-editing__poster-video-frame">
          <video
            className="video-editing__poster-video"
            loop
            muted={allowAudio ? muted : true}
            poster={posterSrc}
            playsInline
            preload="none"
            ref={videoRef}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      ) : (
        <>
          <span className="video-editing__poster-title" aria-hidden="true">
            {treatment === "hush" ? "HUSH" : treatment === "sage" ? "SAGE" : "OMEN"}
          </span>
          <span className="video-editing__poster-play" aria-hidden="true">
            <svg viewBox="0 0 20 22" focusable="false">
              <path d="M0 0 20 11 0 22z" />
            </svg>
          </span>
        </>
      )}
      {allowAudio && videoSrc ? (
        <div className="video-editing__audio-controls">
          <button
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            className="video-editing__sound-toggle"
            onClick={() => setMuted((current) => !current)}
            type="button"
          >
            {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            <span>{muted ? "Unmute" : "Mute"}</span>
          </button>
          <label className="video-editing__volume-slider">
            <span className="sr-only">Video volume</span>
            <input
              aria-label={`${title} video volume`}
              aria-valuetext={`${Math.round(volume * 100)}%`}
              max="1"
              min="0"
              onChange={(event) => {
                const nextVolume = Number(event.currentTarget.value);
                setVolume(nextVolume);
                setMuted(nextVolume === 0);
              }}
              step="0.01"
              type="range"
              value={volume}
            />
          </label>
        </div>
      ) : null}
      <span className="video-editing__poster-note">
        {videoSrc ? allowAudio && !muted ? "AUTO-PLAY · AUDIO ON" : "AUTO-PLAY · MUTED" : "VIDEO PREVIEW PLACEHOLDER"}
      </span>
    </div>
  );
}

export function VideoEditingPortfolio() {
  const [showIntro, setShowIntro] = useState(true);
  const [introDone, setIntroDone] = useState(false);
  const [workSeen, setWorkSeen] = useState(false);
  const [workOrigin, setWorkOrigin] = useState<{ clip: string } | null>(null);
  const [videoVariant, setVideoVariant] = useState<"landscape" | "portrait" | null>(null);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const workTriggerRef = useRef<HTMLButtonElement>(null);
  const workDialogRef = useRef<HTMLDivElement>(null);
  const workCloseRef = useRef<HTMLButtonElement>(null);
  const transition = { duration: 0.78, ease: EASE_OUT };

  function openWork() {
    // Measure the card so the dialog can grow out of it and shrink back into it on close.
    const trigger = workTriggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const radius = window.getComputedStyle(trigger).borderTopLeftRadius || "15px";
      const clip = `inset(${Math.max(rect.top, 0)}px ${Math.max(window.innerWidth - rect.right, 0)}px ${Math.max(
        window.innerHeight - rect.bottom,
        0,
      )}px ${Math.max(rect.left, 0)}px round ${radius})`;
      setWorkOrigin({ clip });
    }
    setIsWorkOpen(true);
  }

  function trackSpotlight(event: ReactPointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShowIntro(false);
      setIntroDone(true);
      return;
    }

    // The hero reveal is driven by `introDone`, which flips the moment the curtain starts lifting,
    // so the page content rises into view underneath it instead of waiting on hard-coded delays.
    const timer = window.setTimeout(() => {
      setShowIntro(false);
      setIntroDone(true);
    }, INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(reducedMotionQuery.matches);
    updatePreference();
    reducedMotionQuery.addEventListener("change", updatePreference);
    return () => reducedMotionQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 700px)");
    const updateVideoVariant = () => setVideoVariant(mobileQuery.matches ? "portrait" : "landscape");
    updateVideoVariant();
    mobileQuery.addEventListener("change", updateVideoVariant);
    return () => mobileQuery.removeEventListener("change", updateVideoVariant);
  }, []);

  useEffect(() => {
    if (!isWorkOpen) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const previousPageInert = pageRef.current?.inert ?? false;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (pageRef.current) pageRef.current.inert = true;
    workCloseRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsWorkOpen(false);
        return;
      }

      if (event.key !== "Tab" || !workDialogRef.current) return;
      const focusable = Array.from(
        workDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        event.preventDefault();
        workDialogRef.current.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      if (pageRef.current) pageRef.current.inert = previousPageInert;
      previouslyFocused?.focus();
    };
  }, [isWorkOpen]);

  return (
    <main className="video-portfolio-page" data-ready={introDone} id="top" ref={pageRef}>
      <AnimatePresence>
        {showIntro ? (
          <motion.div
            aria-hidden="true"
            animate={{ y: 0 }}
            className="video-editing__intro"
            exit={{ y: "-100%" }}
            initial={{ y: 0 }}
            transition={{ duration: CURTAIN_S, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* The mark fades up and away just ahead of the curtain so the two never fight. */}
            <motion.div
              className="video-editing__intro-mark"
              exit={{ opacity: 0, y: -14, transition: { duration: 0.3, ease: "easeIn" } }}
            >
              <span className="video-editing__eyebrow">KIFAYATULLAH MOHAMMAD <i>·</i> VIDEO EDITING</span>
              <span className="video-editing__intro-title">A portfolio in motion.</span>
              <span className="video-editing__intro-progress"><i /></span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div aria-hidden="true" className="video-editing__atmosphere">
        <span className="video-editing__orb video-editing__orb--one" />
        <span className="video-editing__orb video-editing__orb--two" />
        <span className="video-editing__orb video-editing__orb--three" />
        <span className="video-editing__grain" />
      </div>

      <header className="video-editing__header">
        <Link aria-label="Return to Kifayatullah's engineering portfolio" className="video-editing__brand" href="/">
          <img alt="" height="24" src="/logo/kifayat_favicon_512.png" width="24" />
          <span>KIFAYATULLAH MOHAMMAD</span>
          <i aria-hidden="true">/</i>
          <span className="video-editing__brand-role">VIDEO EDITING</span>
        </Link>

        <nav aria-label="Video editing portfolio navigation" className="video-editing__nav">
          <a href="#work">THE EDITS</a>
          <a href="#about">ABOUT</a>
          <a className="video-editing__nav-cta" href="#connect">
            LET&apos;S CONNECT <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
      </header>

      <section aria-labelledby="video-editing-title" className="video-editing__hero">
        <div aria-hidden="true" className="video-editing__hero-video">
          {videoVariant ? (
            <video
              autoPlay
              className="video-editing__background-video"
              key={videoVariant}
              loop
              muted
              playsInline
              preload="none"
              tabIndex={-1}
            >
              <source
                src={`/videos/video-edit-trailer-${videoVariant}.mp4`}
                type="video/mp4"
              />
            </video>
          ) : null}
          <span className="video-editing__video-shade" />
        </div>
        <div className="video-editing__hero-copy">
          <motion.p
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            className="video-editing__eyebrow video-motion"
            initial={{ opacity: 0, y: 14 }}
            transition={{ ...transition, delay: 0.1 }}
          >
            <span aria-hidden="true" /> VIDEO EDITING
          </motion.p>

          <motion.h1
            animate={introDone ? "visible" : "hidden"}
            className="video-editing__title"
            id="video-editing-title"
            initial="hidden"
            variants={{
              hidden: {},
              visible: { transition: { delayChildren: 0.2, staggerChildren: 0.12 } },
            }}
          >
            <span className="video-editing__headline-mask">
              <motion.span
                className="video-editing__headline-line"
                variants={{
                  hidden: { opacity: 0, y: 18, filter: "blur(7px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE_OUT } },
                }}
              >
                Part-time hours,
              </motion.span>
            </span>
            <span className="video-editing__headline-mask">
              <motion.span
                className="video-editing__headline-line"
                variants={{
                  hidden: { opacity: 0, y: 18, filter: "blur(7px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE_OUT } },
                }}
              >
                <em>full-time frames.</em>
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            className="video-editing__lead video-motion"
            initial={{ opacity: 0, y: 18 }}
            transition={{ ...transition, delay: 0.62 }}
          >
            A part-time editor with 85K+ views on Instagram, now looking to take it full-time. I have the skills. I just need the right opportunity to showcase them on long-form content.
          </motion.p>

          <motion.div
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            className="video-editing__capabilities video-motion"
            initial={{ opacity: 0, y: 18 }}
            transition={{ ...transition, delay: 0.74 }}
          >
            <div className="video-editing__capability">
              <Scissors aria-hidden="true" />
              <div><strong>Short-form</strong><span>Reels · Shorts</span></div>
            </div>
            <div className="video-editing__capability">
              <Clapperboard aria-hidden="true" />
              <div><strong>Long-form</strong><span>YouTube · Edits</span></div>
            </div>
            <div className="video-editing__capability">
              <AudioLines aria-hidden="true" />
              <div><strong>All-in-one</strong><span>Edit · Motion · Sound</span></div>
            </div>
          </motion.div>

          <motion.div
            animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            className="video-editing__actions video-motion"
            initial={{ opacity: 0, y: 14 }}
            transition={{ ...transition, delay: 0.86 }}
          >
            <a className="video-editing__button video-editing__button--primary" href="#work">
              View editing work <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="video-editing__button video-editing__button--quiet" href="#connect">
              Let&apos;s collaborate
            </a>
          </motion.div>
        </div>

        <div aria-label="Featured editing work" className="video-editing__showcase">
          {editProjects.slice(0, 3).map((project, index) => (
            <motion.a
              className={`video-editing__showcase-card video-motion ${index === 0 ? "is-featured" : ""}`}
              href={`#${project.id}`}
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              key={project.id}
              transition={transition}
              // The entrance delay lives only inside whileInView, so it can't delay hover.
              // On first load the cards wait for the curtain; later (e.g. mobile scroll) they don't.
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { ...transition, delay: introDone ? index * 0.1 : INTRO_MS / 1000 + 0.3 + index * 0.12 },
              }}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -7, scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.7 } }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.992 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <PlaceholderPoster
                previewLabel={project.previewLabel}
                posterSrc={project.posterSrc}
                title={project.title}
                treatment={project.treatment}
                videoSrc={project.videoSrc}
              />
              <span className="video-editing__showcase-badge">{project.format}</span>
              <span className="video-editing__showcase-caption">
                <span><strong>{project.title}</strong><small>{project.subtitle}</small></span>
                <em>{project.duration}</em>
              </span>
              <span className="video-editing__showcase-arrow" aria-hidden="true"><ArrowUpRight /></span>
            </motion.a>
          ))}
        </div>

        <a className="video-editing__scroll-cue" href="#work">
          <span>SCROLL TO EXPLORE</span><ArrowDown aria-hidden="true" />
        </a>
      </section>

      <motion.section
        aria-label="Explore selected video editing work"
        className="video-editing__work-entry video-editing__section video-motion"
        id="work"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={transition}
        onViewportEnter={() => setWorkSeen(true)}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.button
          aria-controls="video-editing-work-dialog"
          aria-expanded={isWorkOpen}
          aria-haspopup="dialog"
          className={`video-editing__work-cta ${workSeen ? "is-seen" : ""}`}
          onClick={openWork}
          onPointerMove={trackSpotlight}
          ref={workTriggerRef}
          type="button"
          // The card lifts with a spring; its glow and edge light are CSS. Text and thumbnails grow via variants.
          variants={prefersReducedMotion ? undefined : ctaButtonVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.8 }}
        >
          <span className="video-editing__work-cta-copy">
            <motion.span
              className="video-editing__eyebrow"
              transition={ctaGrow}
              variants={prefersReducedMotion ? undefined : ctaEyebrowVariants}
            >
              <motion.i aria-hidden="true" transition={ctaGrow} variants={prefersReducedMotion ? undefined : ctaDotVariants} /> SELECTED WORK
            </motion.span>
            <motion.span
              className="video-editing__work-cta-title"
              style={{ transformOrigin: "left center" }}
              transition={ctaGrow}
              variants={prefersReducedMotion ? undefined : ctaTitleVariants}
            >
              See my work in detail
            </motion.span>
            <motion.span
              className="video-editing__work-cta-subtitle"
              style={{ transformOrigin: "left center" }}
              transition={ctaGrow}
              variants={prefersReducedMotion ? undefined : ctaSubtitleVariants}
            >
              Five edits. The full story, in one place.
            </motion.span>
          </span>
          <span aria-hidden="true" className="video-editing__work-stack">
            {editProjects.slice(0, 3).map((project, index) => (
              <motion.span
                className={`video-editing__work-stack-card is-card-${index + 1}`}
                key={project.id}
                transition={ctaGrow}
                variants={prefersReducedMotion ? undefined : ctaCardVariants[index]}
              >
                <Image alt="" fill sizes="(max-width: 700px) 86px, 150px" src={project.posterSrc} />
                <span>0{index + 1}</span>
              </motion.span>
            ))}
          </span>
          <span aria-hidden="true" className="video-editing__work-cta-arrow"><ArrowUpRight /></span>
        </motion.button>
      </motion.section>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isWorkOpen ? (
                <motion.div
                  aria-labelledby="video-work-title"
                  aria-modal="true"
                  className="video-editing__work-dialog"
                  id="video-editing-work-dialog"
                  // The panel grows out of the card you clicked and collapses back into it on close.
                  // Open and close each carry their own timing (the closing one is a touch quicker).
                  initial={
                    prefersReducedMotion || !workOrigin
                      ? { opacity: 0 }
                      : { opacity: 0.6, clipPath: workOrigin.clip }
                  }
                  animate={
                    prefersReducedMotion || !workOrigin
                      ? { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }
                      : {
                          opacity: 1,
                          clipPath: "inset(0px 0px 0px 0px round 0px)",
                          transition: { duration: 0.62, ease: EASE_PANEL },
                        }
                  }
                  exit={
                    prefersReducedMotion || !workOrigin
                      ? { opacity: 0, transition: { duration: 0.2, ease: "easeOut" } }
                      : { opacity: 0.6, clipPath: workOrigin.clip, transition: { duration: 0.5, ease: EASE_PANEL } }
                  }
                  ref={workDialogRef}
                  role="dialog"
                  tabIndex={-1}
                >
                  <motion.div
                    className="video-editing__work-dialog-header"
                    initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT, delay: prefersReducedMotion ? 0 : 0.22 } }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } }}
                  >
                    <span><i aria-hidden="true" /> SELECTED WORK <b>·</b> 05 EDITS</span>
                    <button
                      aria-label="Close selected work"
                      className="video-editing__work-dialog-close"
                      onClick={() => setIsWorkOpen(false)}
                      ref={workCloseRef}
                      type="button"
                    >
                      <span>Close</span><X aria-hidden="true" />
                    </button>
                  </motion.div>
                  <motion.div
                    className="video-editing__work-dialog-scroll"
                    exit={{ opacity: 0, transition: { duration: 0.18, ease: "easeIn" } }}
                  >
                    <section aria-labelledby="video-work-title" className="video-editing__work video-editing__section">
                      <motion.div
                        className="video-editing__section-heading video-motion"
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ ...transition, delay: 0.3 }}
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <p className="video-editing__eyebrow"><span aria-hidden="true" /> SELECTED WORK</p>
                        <h2 id="video-work-title">The edits, and the thinking behind them.</h2>
                        <p className="video-editing__section-intro">A closer look at the pacing, sound, and creative intent behind each edit.</p>
                      </motion.div>

                      {editProjects.map((project, index) => (
                        <motion.article
                          className={`video-editing__project video-motion ${index % 2 === 1 ? "is-reversed" : ""}`}
                          id={`detail-${project.id}`}
                          custom={index}
                          initial="hidden"
                          key={project.id}
                          variants={projectEntryVariants}
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.18 }}
                        >
                          <motion.div className="video-editing__project-media video-editing__reveal-item" variants={projectMediaVariants}>
                            <PlaceholderPoster
                              highlight={project.highlight}
                              previewLabel={project.previewLabel}
                              posterSrc={project.posterSrc}
                              title={project.title}
                              treatment={project.treatment}
                              videoSrc={project.videoSrc}
                              allowAudio
                            />
                            <span className="video-editing__media-label">{project.format} <i>·</i> AUTOPLAY / SOUND OFF</span>
                          </motion.div>
                          <motion.div className="video-editing__project-copy" variants={projectCopyVariants}>
                            <motion.p className="video-editing__project-meta video-editing__reveal-item" variants={projectTextItemVariants}>
                              {project.subtitle} <span>·</span> {project.duration}
                            </motion.p>
                            <motion.h3 className="video-editing__reveal-item" variants={projectTextItemVariants}>{project.title}</motion.h3>
                            {project.source || project.idea || project.edit || project.builtWith ? (
                              <motion.dl variants={projectCopyVariants}>
                                {project.source ? <motion.div className="video-editing__reveal-item" variants={projectTextItemVariants}><dt>The source</dt><dd>{project.source}</dd></motion.div> : null}
                                {project.idea ? <motion.div className="video-editing__reveal-item" variants={projectTextItemVariants}><dt>The idea</dt><dd>{project.idea}</dd></motion.div> : null}
                                {project.edit ? <motion.div className="video-editing__reveal-item" variants={projectTextItemVariants}><dt>The edit</dt><dd>{project.edit}</dd></motion.div> : null}
                                {project.builtWith ? <motion.div className="video-editing__reveal-item" variants={projectTextItemVariants}><dt>Built with</dt><dd>{project.builtWith}</dd></motion.div> : null}
                              </motion.dl>
                            ) : null}
                          </motion.div>
                        </motion.article>
                      ))}
                    </section>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      <motion.section
        aria-labelledby="video-about-title"
        className="video-editing__about video-editing__section video-motion"
        id="about"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={transition}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 id="video-about-title">Editing is my side job.<br /><span>I’m ready to make it my main one.</span></h2>
        <div className="video-editing__about-copy">
          <p>I’m a part-time video editor looking to turn this into a full-time career. My strongest tool is DaVinci Resolve, and I care most about making content that people finish watching.</p>
          <p>I’m proficient in long-form too, but I haven’t had the chance to make it yet. I’d be happy to show it with your content.</p>
          <div aria-label="Editing skills and formats" className="video-editing__tools">
            {[
              "DaVinci Resolve",
              "Motion",
              "Sound",
              "Reels & Shorts",
              "YouTube edits",
            ].map((tool, index) => (
              <span className={index === 0 ? "is-primary" : ""} key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="video-editing__longform video-editing__section video-motion"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={transition}
        viewport={{ once: true, amount: 0.25 }}
      >
        <div><p className="video-editing__eyebrow">NEXT FRAME</p><h2>Long-form is next.</h2><p>Send me a few hours of footage and I’ll show you what the story looks like.</p></div>
        <a className="video-editing__button video-editing__button--quiet" href="#connect">
          Send footage <ArrowUpRight aria-hidden="true" />
        </a>
      </motion.section>

      <motion.footer
        className="video-editing__contact video-editing__section video-motion"
        id="connect"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={transition}
        viewport={{ once: true, amount: 0.25 }}
      >
        <p className="video-editing__eyebrow">THE NEXT CUT COULD BE YOURS</p>
        <h2>Let’s connect.</h2>
        <p>Have a project, a channel or a role in mind? You can DM me on Instagram at <a href="https://www.instagram.com/rune.riyal/" rel="noreferrer" target="_blank">@rune.riyal</a>, or send me an email.</p>
        <div className="video-editing__contact-actions">
          <a className="video-editing__button video-editing__button--primary" href="https://www.instagram.com/rune.riyal/" rel="noreferrer" target="_blank">
            Message me on Instagram <ArrowUpRight aria-hidden="true" />
          </a>
          <Link className="video-editing__button video-editing__button--quiet" href={CONTACT_HREF}>
            <Mail aria-hidden="true" /> Contact me by email
          </Link>
        </div>
        <div className="video-editing__footer-line">
          <span>BENGALURU, INDIA · VIDEO EDITING</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </motion.footer>
    </main>
  );
}
