import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldCls =
  "mt-1 w-full rounded-card border border-brand-gray-light px-3 py-2 text-sm text-brand-ink outline-none focus-visible:border-brand-red";

export function TextField({
  label,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode; hint?: string }) {
  return (
    <label className="block text-sm">
      {label}
      <input className={cn(fieldCls, className)} {...props} />
      {hint && <span className="mt-1 block text-xs text-brand-gray">{hint}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: ReactNode; hint?: string }) {
  return (
    <label className="block text-sm">
      {label}
      <textarea className={cn(fieldCls, className)} {...props} />
      {hint && <span className="mt-1 block text-xs text-brand-gray">{hint}</span>}
    </label>
  );
}
