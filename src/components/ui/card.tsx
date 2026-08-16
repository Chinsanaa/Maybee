import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({
  padding = "p-6",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { padding?: "p-4" | "p-6" }) {
  return (
    <div
      className={cn(
        "rounded-card border border-brand-gray-light bg-white shadow-card",
        padding,
        className
      )}
      {...props}
    />
  );
}
