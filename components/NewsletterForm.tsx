"use client";

import { subscribeToNewsletter } from "@/actions/contact";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

const NewsletterForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);

  const action = async (formData: FormData) => {
    setPending(true);
    const result = await subscribeToNewsletter(formData);
    setPending(false);
    if (result.ok) {
      toast.success("Thanks for subscribing!");
      formRef.current?.reset();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <Label htmlFor="newsletter-email" className="sr-only">
        Email address
      </Label>
      <Input
        id="newsletter-email"
        name="email"
        placeholder="Enter your email"
        type="email"
        autoComplete="email"
        required
      />
      {/* Spam trap: hidden from people, often filled in by bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Spinner />}
        Subscribe
      </Button>
    </form>
  );
};

export default NewsletterForm;
