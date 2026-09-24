import React from "react";
import { cn } from "@/lib/utils";
interface Props {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}
const Title = ({ children, className, as: Heading = "h2" }: Props) => {
  return (
    <Heading className={cn("text-2xl font-semibold", className)}>
      {children}
    </Heading>
  );
};

export default Title;
