import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "success" | "warning" | "neutral" | "danger";

const variants: Record<BadgeVariant, string> = {
  success: "bg-brand-success-bg text-brand-success",
  warning: "bg-brand-warning-bg text-brand-warning",
  neutral: "bg-brand-gray-light text-brand-ink",
  danger: "bg-brand-red/10 text-brand-red",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", variants[variant], className)}
      {...props}
    />
  );
}
