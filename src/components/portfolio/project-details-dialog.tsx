"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { portfolioData } from "@/src/data/portfolio";

type Project = (typeof portfolioData.career.projects)[number];

const closeXPaySections = [
  { title: "Payments", bullets: ["UPI/QR payment aggregator API across multiple gateways", "Webhook handlers for real-time payment status"] },
  { title: "Money movement", bullets: ["Wallet with real-time balance tracking", "Settlements and a commission engine for automated merchant payouts", "Async payouts on Bull and Redis queues, with retries and status tracking"] },
  { title: "Invoicing", bullets: ["Recurring invoices, automated reminders and a customer portal", "Redis caching on a PostgreSQL and TypeORM backend"] },
  { title: "Security", bullets: ["AES-256 encrypted fields, JWT authentication and IP whitelisting", "API keys with role-based access control and Redis rate limiting", "2FA with OTP via AWS SNS", "Signed webhook validation and audit logging"] },
];
const invoicingSections = [
  { title: "Invoice lifecycle", bullets: ["Drafts with line items, HSN/SAC codes and GST rates", "Numbering per financial year with sequence tracking", "Frozen supplier and customer snapshots at issue, for audit compliance", "Status flow: draft, issued, partially paid, paid", "Recurring invoices and automated reminders"] },
  { title: "GST and calculations", bullets: ["Server-side calculations with precise decimal handling", "Automatic CGST/SGST or IGST by place of supply", "Multiple GST rates (18%, 12%, 5%) per line item", "Live totals with discounts, taxable amounts and tax breakdown"] },
  { title: "PDF and delivery", bullets: ["A4 GST-compliant PDFs generated with Puppeteer", "Handlebars templates, with watermarks on drafts", "Preview in the browser or download", "Email delivery with PDF attached via AWS SES"] },
  { title: "Analytics and audit", bullets: ["Live dashboard of outstanding, overdue and collected amounts", "Event log for every action: created, issued, sent, paid, cancelled", "Bulk send and bulk delete of drafts", "Multi-tenant, with role-based access and merchant data isolation"] },
];
const rupeeFlowHighlights = [
  "Co-built the full multi-page site, working across every page in the navigation alongside one other developer.",
  "Product pages for the payment gateway, payment links, UPI collections, cross-border collections, bulk payouts, vendor payments, salary disbursements, bill payments and the credit products.",
  "An interactive loan calculator with amount slider, EMI and eligibility flow.",
  "Audience-based solution sections for MSMEs, small merchants, NRIs and developers.",
  "Partnership pages, blog, legal pages and the footer.",
  "SEO metadata, Open Graph and Twitter cards.",
];

const screenshots = [
  { src: "/images/gateway/closexpay.png", caption: "Merchant dashboard overview" },
  { src: "/images/gateway/transaction%20details.png", caption: "Transactions and payments" },
  { src: "/images/gateway/payment%20links.png", caption: "Payment links" },
];
const invoicingScreenshots = [
  { src: "/images/invoicing/invoices%20ss.png", caption: "Invoice dashboard overview" },
  { src: "/images/invoicing/invoice%20e%3Ddetails.png", caption: "Invoice details" },
  { src: "/images/invoicing/invoices%20recurring.png", caption: "Recurring invoices" },
];

export function ProjectDetailsDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);
  const isCloseXPay = project.id === "closexpay-gateway";
  const isInvoicing = project.id === "invoicing-platform";
  const isRupeeFlow = project.id === "rupeeflow-site";
  const projectScreenshots = isCloseXPay ? screenshots : isInvoicing ? invoicingScreenshots : [];
  const sections = isCloseXPay ? closeXPaySections : invoicingSections;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    const dialog = lightboxRef.current;
    if (activeImage !== null && dialog && !dialog.open) dialog.showModal();
    if (activeImage === null && dialog?.open) dialog.close();
  }, [activeImage]);

  function showImage(index: number) {
    setActiveImage((index + projectScreenshots.length) % projectScreenshots.length);
  }

  return (
    <dialog
      aria-labelledby="project-modal-title"
      className="project-details-dialog"
      onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="project-details">
        <header className="project-details__header">
          <div>
            <p className="project-details__eyebrow">Project details</p>
            <h2 id="project-modal-title">{project.title}</h2>
            {isCloseXPay ? <p className="project-details__summary">Payments, wallet, payouts and invoicing for merchants.</p> : null}
            {isCloseXPay ? <p className="project-details__summary">Worked across multiple dashboards, including PayBolt and FinMatrix.</p> : null}
            {isInvoicing ? <p className="project-details__summary">GST-compliant invoicing with PDF generation, email delivery and payment tracking.</p> : null}
            {isRupeeFlow ? <p className="project-details__summary">Marketing site for RupeeFlow, a fintech platform for payments, payouts and business credit.</p> : null}
            {isRupeeFlow ? <p className="project-details__meta">Freelance · February 2026 · About one month</p> : null}
          </div>
          <button aria-label="Close project details" className="project-details__close" onClick={() => dialogRef.current?.close()} type="button"><X /></button>
        </header>

        {isCloseXPay || isInvoicing ? (
          <>
            <div className="project-details__tags" aria-label="Technology stack">
              {(isCloseXPay ? ["Next.js", "NestJS", "PostgreSQL", "TypeORM", "Redis", "Bull", "AWS"] : ["Next.js", "NestJS", "TypeORM", "PostgreSQL", "Redis", "Puppeteer", "Handlebars", "AWS SES"]).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            {isCloseXPay ? <a className="project-details__visit" href="https://closexpay.in" rel="noreferrer" target="_blank">Visit closexpay.in <ArrowUpRight aria-hidden="true" /></a> : null}

            {isInvoicing ? <div className="project-details__stats" aria-label="Project highlights"><div><strong>30+</strong><span>merchants</span></div><div><strong>CGST / SGST / IGST</strong><span>handled automatically</span></div><div><strong>PDF + email</strong><span>delivery end to end</span></div></div> : null}

            <div className="project-details__sections">
              {sections.slice(0, 2).map((section) => <FeatureGroup key={section.title} section={section} />)}
            </div>
            <ScreenshotPlaceholder image={projectScreenshots[0]} index={0} loaded={loadedImages.includes(0)} onLoad={() => setLoadedImages((items) => [...items, 0])} onOpen={() => showImage(0)} />
            <div className="project-details__sections">
              {sections.slice(2, 3).map((section) => <FeatureGroup key={section.title} section={section} />)}
            </div>
            <ScreenshotPlaceholder image={projectScreenshots[1]} index={1} loaded={loadedImages.includes(1)} onLoad={() => setLoadedImages((items) => [...items, 1])} onOpen={() => showImage(1)} />
            <div className="project-details__sections">
              {sections.slice(3).map((section) => <FeatureGroup key={section.title} section={section} />)}
            </div>
            <ScreenshotPlaceholder image={projectScreenshots[2]} index={2} loaded={loadedImages.includes(2)} onLoad={() => setLoadedImages((items) => [...items, 2])} onOpen={() => showImage(2)} />
          </>
        ) : isRupeeFlow ? (
          <>
            <div className="project-details__tags" aria-label="Technology stack"><span>Next.js</span></div>
            <a className="project-details__visit" href="https://rupeeflow.co" rel="noreferrer" target="_blank">Visit rupeeflow.co <ArrowUpRight aria-hidden="true" /></a>
            <div className="project-details__sections project-details__sections--generic">
              <FeatureGroup section={{ title: "What I built", bullets: rupeeFlowHighlights }} />
            </div>
          </>
        ) : (
          <div className="project-details__sections project-details__sections--generic">
            {[project.context, project.built, project.hard, project.outcome].filter(Boolean).map((text, index) => <FeatureGroup key={text} section={{ title: ["Context", "What I built", "What was hard", "Outcome"][index], bullets: [text] }} />)}
          </div>
        )}
      </div>

      <dialog aria-label="Screenshot preview" className="project-lightbox" onClick={(event) => { if (event.target === event.currentTarget) setActiveImage(null); }} onClose={() => setActiveImage(null)} ref={lightboxRef}>
        {activeImage !== null ? (
          <div className="project-lightbox__content">
            <button aria-label="Previous screenshot" className="project-lightbox__arrow project-lightbox__arrow--prev" onClick={() => showImage(activeImage - 1)} type="button"><ArrowLeft /></button>
            {loadedImages.includes(activeImage) ? <img alt={projectScreenshots[activeImage].caption} src={projectScreenshots[activeImage].src} /> : <div className="project-lightbox__placeholder">Screenshot placeholder · {projectScreenshots[activeImage].caption}</div>}
            <button aria-label="Next screenshot" className="project-lightbox__arrow project-lightbox__arrow--next" onClick={() => showImage(activeImage + 1)} type="button"><ArrowRight /></button>
            <button aria-label="Close screenshot preview" className="project-lightbox__close" onClick={() => setActiveImage(null)} type="button"><X /></button>
          </div>
        ) : null}
      </dialog>
    </dialog>
  );
}

function FeatureGroup({ section }: { section: { title: string; bullets: string[] } }) {
  return <section className="project-feature-group"><h3>{section.title}</h3><ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></section>;
}

function ScreenshotPlaceholder({ image, index, loaded, onLoad, onOpen }: { image: (typeof screenshots)[number]; index: number; loaded: boolean; onLoad: () => void; onOpen: () => void }) {
  return (
    <figure className="project-screenshot">
      <button aria-label={`Open screenshot: ${image.caption}`} className="project-screenshot__image" onClick={onOpen} type="button">
        <span className="project-screenshot__badge">Demo data</span>
        {loaded ? null : <span className="project-screenshot__placeholder">Screenshot {index + 1} placeholder</span>}
        {/* Keep a missing future upload as a styled placeholder until its image is added. */}
        <img alt="" aria-hidden="true" onError={(event) => event.currentTarget.remove()} onLoad={onLoad} src={image.src} />
      </button>
      <figcaption>{image.caption}</figcaption>
    </figure>
  );
}
