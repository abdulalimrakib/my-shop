"use client";

import { sendContactMessage } from "@/actions/contact";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const action = async (formData: FormData) => {
    setPending(true);
    setStatus(null);
    const result = await sendContactMessage(formData);
    setPending(false);
    if (result.ok) {
      formRef.current?.reset();
      setStatus({
        type: "success",
        message: "Thanks! We got your message and will reply by email soon.",
      });
    } else {
      setStatus({ type: "error", message: result.error });
    }
  };

  return (
    <form ref={formRef} action={action} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" autoComplete="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact-subject">Subject</Label>
        <Input id="contact-subject" name="subject" maxLength={150} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          minLength={10}
          maxLength={5000}
          required
        />
      </div>
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {status && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`text-sm font-medium ${status.type === "error" ? "text-red-600" : "text-shop_dark_green"}`}
        >
          {status.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending && <Spinner />}
        Send message
      </Button>
    </form>
  );
};

export default ContactForm;
