"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, ExternalLink } from "lucide-react";
import { portfolioData } from "@/src/data/portfolio";
import { PanelReveal } from "@/src/components/portfolio/panel-reveal";

type CareerSectionProps = {
  active: boolean;
};

export function CareerExperienceSection({ active }: CareerSectionProps) {
  const career = portfolioData.career;

  return (
    <div className="panel-scroll career-scroll" data-panel-scroll>
      <PanelReveal active={active} className="interior-content">
        {/* Section Heading */}
        <div className="interior-heading-row">
          <div>
            <p className="interior-eyebrow font-mono panel-reveal__item reveal-step-1">
              01 / EXPERIENCE
            </p>
            <h2
              className="interior-heading panel-reveal__item reveal-step-2"
              data-section-heading
              id="career-experience-title"
              tabIndex={-1}
            >
              Work Experience
            </h2>
          </div>
          <p className="interior-deck panel-reveal__item reveal-step-3">
            {career.experienceIntro}
          </p>
        </div>

        {/* High-Engineering Experience Cards Grid with Smooth Modern Hover */}
        <ol aria-label={career.timelineLabel} className="experience-cards-grid">
          {career.experiences.map((experience, index) => (
            <li className="experience-card-item panel-reveal__item" key={experience.id}>
              <motion.article
                className="experience-card"
                whileHover={{
                  y: -6,
                  transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                {/* Top Accent Strip */}
                <div className="experience-card__accent-bar" aria-hidden="true" />

                <div className="experience-card__header">
                  <div className="flex items-center justify-between gap-2">
                    <span className="experience-card__date font-mono">
                      {experience.date || "Independent Project"}
                    </span>
                    <span className="experience-card__index font-mono">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="experience-card__title font-sans">
                    {experience.title}
                  </h3>

                  {experience.organization ? (
                    <div className="experience-card__org-row">
                      <span className="experience-card__organization font-sans">
                        {experience.organization}
                      </span>
                      {experience.location ? (
                        <span className="experience-card__location font-mono">
                          · {experience.location}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {experience.summary ? (
                  <p className="experience-card__summary font-mono text-xs">
                    {experience.summary}
                  </p>
                ) : null}

                {experience.details.length ? (
                  <ul className="experience-card__bullets">
                    {experience.details.map((detail) => (
                      <li key={detail}>
                        <span className="bullet-dot" aria-hidden="true" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Footer with links */}
                <div className="experience-card__footer">
                  {experience.links.map((link) => (
                    <a
                      className="experience-link"
                      href={link.href}
                      key={link.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </motion.article>
            </li>
          ))}
        </ol>
      </PanelReveal>
    </div>
  );
}

export function SelectedWorkSection({ active }: CareerSectionProps) {
  const career = portfolioData.career;
  const fields = career.projectFields;
  const [openProjectId, setOpenProjectId] = useState<string | null>("closexpay-gateway");

  return (
    <div className="panel-scroll career-scroll selected-work-scroll" data-panel-scroll>
      <PanelReveal active={active} className="interior-content">
        {/* Section Heading */}
        <div className="interior-heading-row">
          <div>
            <p className="interior-eyebrow font-mono panel-reveal__item reveal-step-1">
              02 / SELECTED PROJECTS
            </p>
            <h2
              className="interior-heading panel-reveal__item reveal-step-2"
              data-section-heading
              id="selected-work-title"
              tabIndex={-1}
            >
              Selected Projects
            </h2>
          </div>
          <p className="interior-deck panel-reveal__item reveal-step-3">
            {career.selectedWorkIntro}
          </p>
        </div>

        {/* High-Engineering Work Cards */}
        <div className="work-cards-grid">
          {career.projects.map((project, index) => {
            const isExpanded = openProjectId === project.id;
            const detailsId = `project-details-${project.id}`;

            const details = [
              { label: fields.context, value: project.context },
              { label: fields.built, value: project.built },
              { label: fields.hard, value: project.hard },
              { label: fields.outcome, value: project.outcome },
            ].filter((field) => field.value.trim().length > 0);

            return (
              <motion.article
                layout
                transition={{
                  layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                }}
                className={`work-card panel-reveal__item ${isExpanded ? "is-active" : ""}`}
                key={project.id}
              >
                <div className="work-card__header">
                  <button
                    aria-controls={detailsId}
                    aria-expanded={isExpanded}
                    className="work-card__trigger"
                    onClick={() =>
                      setOpenProjectId((current) => (current === project.id ? null : project.id))
                    }
                    type="button"
                  >
                    <div className="work-card__index-col font-mono">
                      0{index + 1}
                    </div>

                    <div className="work-card__title-col">
                      <h3 className="work-card__title font-sans">{project.title}</h3>
                      <p className="work-card__descriptor font-mono text-xs">
                        {project.descriptor}
                      </p>
                    </div>

                    <div className="work-card__chevron-col">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ease-out ${
                          isExpanded ? "rotate-180 text-accent" : "text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      aria-hidden={false}
                      className="work-card__body is-open"
                      id={detailsId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="work-card__body-inner">
                        <dl className="work-card__specs-grid">
                          {details.map((field) => (
                            <div key={field.label} className="spec-item">
                              <dt className="spec-label font-mono">{field.label}</dt>
                              <dd className="spec-value font-sans">{field.value}</dd>
                            </div>
                          ))}
                        </dl>

                        <div className="work-card__actions">
                          {project.links.map((link) => (
                            <a
                              className="work-card__action-link"
                              href={link.href}
                              key={link.href}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </PanelReveal>
    </div>
  );
}
