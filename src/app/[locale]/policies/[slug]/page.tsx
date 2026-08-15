import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getBusinessInfo } from "@/lib/business-info";
import { Breadcrumbs } from "@/components/shop/breadcrumbs";

const POLICIES: Record<
  string,
  { titleMn: string; titleEn: string }
> = {
  delivery: { titleMn: "Хүргэлтийн бодлого", titleEn: "Delivery Policy" },
  returns: { titleMn: "Буцаалт, солилцооны бодлого", titleEn: "Return & Refund Policy" },
  privacy: { titleMn: "Нууцлалын бодлого", titleEn: "Privacy Policy" },
  terms: { titleMn: "Үйлчилгээний нөхцөл", titleEn: "Terms of Service" },
};

export async function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const policy = POLICIES[slug];
  if (!policy) return {};
  return {
    title: locale === "en" ? policy.titleEn : policy.titleMn,
    alternates: { canonical: `/${locale}/policies/${slug}` },
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];
  if (!policy) notFound();

  const [locale, business] = await Promise.all([getLocale(), getBusinessInfo()]);
  const title = locale === "en" ? policy.titleEn : policy.titleMn;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        locale={locale}
        items={[
          { name: locale === "en" ? "Home" : "Нүүр", href: "/" },
          { name: title, href: `/policies/${slug}` },
        ]}
      />
      <h1 className="font-display text-3xl font-extrabold text-brand-ink">{title}</h1>
      <div className="mt-6 rounded-card border border-brand-gray-light bg-white p-6 text-sm text-brand-gray">
        <p>
          {locale === "en"
            ? `${business.name} is finalizing this policy. In the meantime, please contact us directly with any questions — we're happy to help before or after you order.`
            : `${business.name} энэ бодлогыг эцэслэж байна. Асуух зүйл байвал захиалгын өмнө болон дараа бидэнтэй шууд холбогдоорой — бид туслахдаа таатай байх болно.`}
        </p>
        <p className="mt-4">
          {locale === "en" ? "Phone: " : "Утас: "}
          <a href={`tel:${business.phone.replace(/\s+/g, "")}`} className="font-semibold text-brand-red">
            {business.phone}
          </a>
        </p>
      </div>
    </div>
  );
}
