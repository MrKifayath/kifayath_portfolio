"use client";

import { ArrowUpRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { portfolioData } from "@/src/data/portfolio";

type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

export function ContactForm() {
  const copy = portfolioData.contact.form;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };
    const nextErrors: FieldErrors = {};

    if (!values.name) {
      nextErrors.name = copy.errors.required;
    } else if (values.name.length > 80) {
      nextErrors.name = copy.errors.nameTooLong;
    }

    if (!values.email) {
      nextErrors.email = copy.errors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = copy.errors.invalidEmail;
    }

    if (!values.message) {
      nextErrors.message = copy.errors.required;
    } else if (values.message.length < 10) {
      nextErrors.message = copy.errors.messageTooShort;
    } else if (values.message.length > 5000) {
      nextErrors.message = copy.errors.messageTooLong;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSubmissionError(copy.errors.invalidRequest);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json()) as {
        errors?: FieldErrors;
        ok?: boolean;
      };

      if (!response.ok) {
        setErrors(result.errors ?? {});
        setSubmissionError(copy.errors.invalidRequest);
        return;
      }

      setIsSubmitted(true);
      form.reset();
    } catch {
      setSubmissionError(copy.failureMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setErrors({});
    setSubmissionError("");
    setIsSubmitted(false);
  }

  return (
    <div className="contact-form-panel">
      {isSubmitted ? (
        <div className="contact-success" role="status" aria-live="polite">
          <p className="section-eyebrow">{copy.successHeading}</p>
          <h3>{copy.successMessage}</h3>
          <button className="text-action" onClick={resetForm} type="button">
            {copy.sendAnother}
            <ArrowUpRight aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="contact-form-panel__heading">
            <h3>{copy.heading}</h3>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="contact-name">{copy.nameLabel}</label>
              <input
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
                id="contact-name"
                maxLength={80}
                name="name"
                placeholder={copy.namePlaceholder}
                required
                type="text"
              />
              {errors.name ? (
                <span className="form-field__error" id="contact-name-error">
                  {errors.name}
                </span>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="contact-email">{copy.emailLabel}</label>
              <input
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                id="contact-email"
                maxLength={254}
                name="email"
                placeholder={copy.emailPlaceholder}
                required
                type="email"
              />
              {errors.email ? (
                <span className="form-field__error" id="contact-email-error">
                  {errors.email}
                </span>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="contact-message">{copy.messageLabel}</label>
              <textarea
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                aria-invalid={Boolean(errors.message)}
                id="contact-message"
                maxLength={5000}
                minLength={10}
                name="message"
                placeholder={copy.messagePlaceholder}
                required
                rows={4}
              />
              {errors.message ? (
                <span className="form-field__error" id="contact-message-error">
                  {errors.message}
                </span>
              ) : null}
            </div>

            {submissionError ? (
              <p className="form-submit-error" role="alert">
                {submissionError}
              </p>
            ) : null}

            <button className="action-link action-link--primary form-submit" disabled={isSubmitting} type="submit">
              <span>{isSubmitting ? copy.sendingLabel : copy.submitLabel}</span>
              <ArrowUpRight aria-hidden="true" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
