import type { ButtonHTMLAttributes } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors duration-fast disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-red text-white hover:bg-brand-red-dark",
  secondary: "border-2 border-brand-ink text-brand-ink hover:bg-brand-ink hover:text-white",
  ghost: "text-brand-red hover:underline font-semibold",
  danger: "text-brand-red hover:underline font-semibold",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
};

function variantClass(variant: ButtonVariant, size: ButtonSize) {
  const isTextOnly = variant === "ghost" || variant === "danger";
  return cn(isTextOnly ? "" : base, isTextOnly ? variants[variant] : cn(variants[variant], sizes[size]));
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={cn(variantClass(variant, size), className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <Link href={href} className={cn(variantClass(variant, size), className)} {...props}>
      {children}
    </Link>
  );
}
