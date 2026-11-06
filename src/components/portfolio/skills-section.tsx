"use client";

import {
  Award,
  Cloud,
  Code2,
  Cpu,
  Globe,
  Layers,
  Server,
  Wrench,
} from "lucide-react";
import { portfolioData } from "@/src/data/portfolio";
import { PanelReveal } from "@/src/components/portfolio/panel-reveal";

type SkillsSectionProps = {
  active: boolean;
};

function getSkillGroupIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("frontend")) return <Code2 className="w-4 h-4 text-accent" />;
  if (normalized.includes("backend")) return <Server className="w-4 h-4 text-accent" />;
  if (normalized.includes("cloud")) return <Cloud className="w-4 h-4 text-accent" />;
  if (normalized.includes("engineering") || normalized.includes("cad") || normalized.includes("tools"))
    return <Cpu className="w-4 h-4 text-accent" />;
  if (normalized.includes("testing") || normalized.includes("automation"))
    return <Wrench className="w-4 h-4 text-accent" />;
  if (normalized.includes("certificate")) return <Award className="w-4 h-4 text-accent" />;
  if (normalized.includes("spoken") || normalized.includes("languages"))
    return <Globe className="w-4 h-4 text-accent" />;
  return <Layers className="w-4 h-4 text-accent" />;
}

export function SkillsSection({ active }: SkillsSectionProps) {
  const skills = portfolioData.skills;

  return (
    <div className="panel-scroll skills-scroll" data-panel-scroll>
      <PanelReveal active={active} className="interior-content">
        {/* Section Heading */}
        <div className="interior-heading-row">
          <div>
            <p className="interior-eyebrow font-mono panel-reveal__item reveal-step-1">
              03 / TECHNICAL STACK
            </p>
            <h2
              className="interior-heading panel-reveal__item reveal-step-2"
              data-section-heading
              id="skills-title"
              tabIndex={-1}
            >
              Working Toolkit
            </h2>
          </div>
          <p className="interior-deck panel-reveal__item reveal-step-3">
            {skills.intro}
          </p>
        </div>

        {/* Modular Skills Grid */}
        <div className="skills-modular-grid">
          {skills.groups.map((group, index) => (
            <article
              aria-labelledby={`skill-group-${index}`}
              className="skill-category-card panel-reveal__item"
              key={group.label}
            >
              <div className="skill-category-card__header">
                <span className="skill-category-card__icon" aria-hidden="true">
                  {getSkillGroupIcon(group.label)}
                </span>
                <h3
                  className="skill-category-card__title font-mono text-xs uppercase"
                  id={`skill-group-${index}`}
                >
                  {group.label}
                </h3>
              </div>

              <div className="skill-category-card__tags">
                {group.items.map((item) => (
                  <span className="skill-tag-pill font-mono" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </PanelReveal>
    </div>
  );
}
