"use client";

import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { portfolioData } from "@/src/data/portfolio";
import { ContactForm } from "@/src/components/portfolio/contact-form";
import { PanelReveal } from "@/src/components/portfolio/panel-reveal";

type ContactSectionProps = {
  active: boolean;
};

export function ContactSection({ active }: ContactSectionProps) {
  const contact = portfolioData.contact;
  const [copyStatus, setCopyStatus] = useState("");

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopyStatus(contact.copiedEmail);
    } catch {
      setCopyStatus(contact.copyFailed);
    }
  }

  return (
    <div className="panel-scroll contact-scroll" data-panel-scroll>
      <PanelReveal active={active} className="contact-content">
        <div className="section-heading-row contact-heading-row">
          <div>
            <p className="section-eyebrow contact-section-eyebrow panel-reveal__item reveal-step-1">{contact.eyebrow}</p>
            <h2
              className="contact-heading panel-reveal__item reveal-step-2"
              data-section-heading
              id="contact-title"
              tabIndex={-1}
            >
              {contact.heading}
            </h2>
          </div>
          <p className="contact-intro panel-reveal__item reveal-step-3">{contact.intro}</p>
        </div>

        <div className="contact-layout panel-reveal__item reveal-step-4">
          <div className="contact-details">
            <p className="contact-details__label">{contact.emailLabel}</p>
            <a className="contact-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <button className="copy-email" onClick={copyEmail} type="button">
              {copyStatus === contact.copiedEmail ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              <span>{copyStatus === contact.copiedEmail ? contact.copiedEmail : contact.copyEmail}</span>
            </button>
            {copyStatus ? (
              <p className="copy-status" role="status" aria-live="polite">
                {copyStatus}
              </p>
            ) : null}

            <nav className="contact-links" aria-label={contact.socialProfilesLabel}>
              {[contact.linkedIn, contact.github].map((link) => (
                <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
                  {link.label}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </nav>

            <a
              className="resume-download"
              download="Kifayatullah-Mohammad-Resume.pdf"
              href={contact.resumeHref}
            >
              <Download aria-hidden="true" />
              <span>{contact.resumeLabel}</span>
            </a>
          </div>

          <ContactForm />
        </div>

        <footer className="portfolio-footer">
          <span>{contact.footer}</span>
          <span>{portfolioData.identity.name}</span>
        </footer>
      </PanelReveal>
    </div>
  );
}
