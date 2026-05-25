"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/content/brand";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const subject = encodeURIComponent(String(form.get("subject") || `${SITE_NAME} inquiry`));
    const body = encodeURIComponent(
      `Name: ${form.get("name")}\nEmail: ${form.get("email")}\nPhone: ${form.get("phone")}\n\n${form.get("message")}`,
    );
    window.location.href = `mailto:bookings@tuxedoretreat.com?subject=${subject}&body=${body}`;
    setStatus("success");
  }

  if (status === "success") {
    return (
      <p className="rounded-xl bg-sage-50 p-6 text-sm text-sage-800">
        Your email client should open — send the message to reach your host.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel space-y-5 rounded-2xl p-6 shadow-lg">
      <FormField label="Name" name="name" required />
      <FormField label="Email" name="email" type="email" required />
      <FormField label="Phone" name="phone" type="tel" />
      <FormField label="Subject" name="subject" />
      <FormField label="Message" name="message" as="textarea" rows={5} required />
      <Button type="submit">Send via Email</Button>
    </form>
  );
}
