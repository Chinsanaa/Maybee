import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 rounded-full focus-visible:outline-none",
        className
      )}
      aria-label="Maybee Pop & Joy — нүүр хуудас"
    >
      <span className="relative block h-10 w-10 overflow-hidden rounded-full bg-brand-red">
        <Image
          src="/brand/maybee-logo.jpg"
          alt=""
          fill
          sizes="40px"
          className="object-cover"
          priority
        />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-brand-ink">
        MayBee
      </span>
    </Link>
  );
}
