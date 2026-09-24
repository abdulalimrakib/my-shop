import { CommentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contactMessageType = defineType({
  name: "contactMessage",
  title: "Contact Messages",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "subject", title: "Subject", type: "string" }),
    defineField({ name: "message", title: "Message", type: "text" }),
    defineField({ name: "sentAt", title: "Sent At", type: "datetime" }),
    defineField({
      name: "handled",
      title: "Handled",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: { select: { title: "subject", subtitle: "email" } },
});
