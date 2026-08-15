import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export function Breadcrumbs({
  items,
  locale,
}: {
  items: { name: string; href: string }[];
  locale: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-brand-gray">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(items.map((i) => ({ name: i.name, url: `/${locale}${i.href}` })))
          ),
        }}
      />
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden>/</span>}
            {i === items.length - 1 ? (
              <span className="font-medium text-brand-ink" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-brand-red">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
