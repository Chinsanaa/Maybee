import { Link } from "@/i18n/navigation";
import { mergeQuery } from "@/lib/query";
import { cn } from "@/lib/utils";

export function Pagination({
  basePath,
  searchParams,
  page,
  pageSize,
  total,
}: {
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
  page: number;
  pageSize: number;
  total: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {pages.map((p) => (
        <Link
          key={p}
          href={`${basePath}${mergeQuery(searchParams, { page: p === 1 ? null : String(p) })}`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
            p === page ? "bg-brand-red text-white" : "text-brand-ink hover:bg-brand-gray-light/50"
          )}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
