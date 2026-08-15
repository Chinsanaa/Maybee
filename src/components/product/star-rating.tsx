import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const dims = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(dims, i <= Math.round(value) ? "fill-brand-honey text-brand-honey" : "text-brand-gray-light")}
          aria-hidden
        />
      ))}
    </span>
  );
}
