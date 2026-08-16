import type { BusinessInfo, StoreLocation } from "@/lib/business-info";
import type { Tables } from "@/lib/database.types";

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function organizationJsonLd(business: BusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    url: siteUrl(),
    logo: business.logo_url || undefined,
    sameAs: [business.instagram_url, business.facebook_url, business.tiktok_url].filter(
      Boolean
    ),
  };
}

export function websiteJsonLd(business: BusinessInfo, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: business.name,
    url: siteUrl(),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl()}/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

const DAY_MAP: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/** LocalBusiness schema for one specific branch (Maybee has multiple). */
export function localBusinessJsonLd(location: StoreLocation, business: BusinessInfo, locale: string) {
  const openingHours = Object.entries(location.hours || {})
    .filter(([, v]) => v)
    .map(([day, v]) => `${DAY_MAP[day]} ${v!.open}-${v!.close}`);

  return {
    "@context": "https://schema.org",
    "@type": "ToyStore",
    name: `${business.name} — ${location.name_mn}`,
    image: location.image_url || business.logo_url || undefined,
    telephone: location.phone || business.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: location.city,
      addressRegion: location.district || undefined,
      addressCountry: "MN",
    },
    geo:
      location.latitude && location.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : undefined,
    openingHoursSpecification: openingHours,
    url: `${siteUrl()}/${locale}/store/${location.slug}`,
    sameAs: [business.instagram_url, business.facebook_url].filter(Boolean),
  };
}

export function blogPostingJsonLd(
  post: { title_mn: string; title_en: string; excerpt_mn: string; excerpt_en: string; cover_image_url: string | null; author_name: string | null; published_at: string | null; updated_at: string; slug: string },
  locale: string,
  business: BusinessInfo
) {
  const title = locale === "en" && post.title_en ? post.title_en : post.title_mn;
  const description = locale === "en" && post.excerpt_en ? post.excerpt_en : post.excerpt_mn;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || undefined,
    image: post.cover_image_url || undefined,
    author: { "@type": "Organization", name: post.author_name || business.name },
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at,
    url: `${siteUrl()}/${locale}/blog/${post.slug}`,
    mainEntityOfPage: `${siteUrl()}/${locale}/blog/${post.slug}`,
  };
}

/** FAQPage schema — built only from real, active FAQ rows, never fabricated. */
export function faqJsonLd(faqs: { question_mn: string; question_en: string; answer_mn: string; answer_en: string }[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: locale === "en" && faq.question_en ? faq.question_en : faq.question_mn,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "en" && faq.answer_en ? faq.answer_en : faq.answer_mn,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl()}${item.url}`,
    })),
  };
}

type ProductWithImages = Tables<"product"> & { product_image: Tables<"product_image">[] };

export function productJsonLd(
  product: ProductWithImages,
  locale: string,
  business: BusinessInfo,
  reviewStats?: { count: number; average: number } | null
) {
  const name = locale === "en" && product.name_en ? product.name_en : product.name_mn;
  const description =
    locale === "en" && product.short_desc_en ? product.short_desc_en : product.short_desc_mn;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || undefined,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    image: product.product_image.map((img) => img.url),
    // Only included when real approved reviews exist — never fabricated.
    aggregateRating:
      reviewStats && reviewStats.count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: reviewStats.average,
            reviewCount: reviewStats.count,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency_code,
      price: product.price,
      availability:
        product.stock_status === "OUT_OF_STOCK"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: business.name },
    },
  };
}
