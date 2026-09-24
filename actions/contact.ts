"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { createHash } from "crypto";
import { z } from "zod";

export type FormResult = { ok: true } | { ok: false; error: string };

const emailSchema = z.string().trim().toLowerCase().email("Please enter a valid email.");

export async function subscribeToNewsletter(formData: FormData): Promise<FormResult> {
  // Hidden field real visitors never fill in
  if (formData.get("company")) return { ok: true };
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { ok: false, error: email.error.issues[0].message };

  // One document per email address, so repeat sign-ups are harmless
  const id = `subscriber-${createHash("sha256").update(email.data).digest("hex").slice(0, 32)}`;
  try {
    await backendClient.createIfNotExists({
      _id: id,
      _type: "subscriber",
      email: email.data,
      subscribedAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return { ok: false, error: "Couldn't subscribe right now. Please try again." };
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: emailSchema,
  subject: z.string().trim().min(1, "Please enter a subject.").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Your message should be at least 10 characters.")
    .max(5000),
});

export async function sendContactMessage(formData: FormData): Promise<FormResult> {
  if (formData.get("company")) return { ok: true };
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  try {
    await backendClient.create({
      _type: "contactMessage",
      ...parsed.data,
      sentAt: new Date().toISOString(),
      handled: false,
    });
    return { ok: true };
  } catch (error) {
    console.error("Contact message failed", error);
    return { ok: false, error: "Couldn't send your message. Please try again." };
  }
}
