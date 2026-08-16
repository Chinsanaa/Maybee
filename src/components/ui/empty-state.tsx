import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      {Icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream">
          <Icon className="h-6 w-6 text-brand-gray" aria-hidden />
        </span>
      )}
      <p className="font-semibold text-brand-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-brand-gray">{description}</p>}
      {action}
    </div>
  );
}
