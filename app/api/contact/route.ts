import { Resend } from "resend";
import { portfolioData } from "@/src/data/portfolio";

const resend = new Resend(process.env.RESEND_API_KEY);
const maxRequestBytes = 8_192;
const maxNameLength = 80;
const maxEmailLength = 254;
const maxMessageLength = 5_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxRequestBytes) {
    return Response.json({ errors: { form: portfolioData.contact.form.errors.messageTooLong } }, { status: 413 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return Response.json({ errors: { form: portfolioData.contact.form.errors.invalidRequest } }, { status: 400 });
  }

  if (new TextEncoder().encode(rawBody).byteLength > maxRequestBytes) {
    return Response.json({ errors: { form: portfolioData.contact.form.errors.messageTooLong } }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ errors: { form: portfolioData.contact.form.errors.invalidRequest } }, { status: 400 });
  }

  if (
    !isRecord(payload) ||
    Object.keys(payload).some((key) => !["name", "email", "message"].includes(key))
  ) {
    return Response.json({ errors: { form: portfolioData.contact.form.errors.invalidRequest } }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const errors: Record<string, string> = {};
  const formCopy = portfolioData.contact.form;

  if (!name) {
    errors.name = formCopy.errors.required;
  } else if (name.length > maxNameLength) {
    errors.name = formCopy.errors.nameTooLong;
  }

  if (!email) {
    errors.email = formCopy.errors.required;
  } else if (email.length > maxEmailLength || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = formCopy.errors.invalidEmail;
  }

  if (!message) {
    errors.message = formCopy.errors.required;
  } else if (message.length < 10) {
    errors.message = formCopy.errors.messageTooShort;
  } else if (message.length > maxMessageLength) {
    errors.message = formCopy.errors.messageTooLong;
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  // Send email via Resend
  try {
    const emailTo = process.env.EMAIL_TO || "kifayatullah.mhmd@gmail.com";
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

    await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return Response.json({ ok: true, deliveryEnabled: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to send email:", error);
    return Response.json(
      { errors: { form: "Failed to send message. Please try again later." } },
      { status: 500 }
    );
  }
}
