import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subscriberType = defineType({
  name: "subscriber",
  title: "Newsletter Subscribers",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
    }),
  ],
  preview: { select: { title: "email", subtitle: "subscribedAt" } },
});
