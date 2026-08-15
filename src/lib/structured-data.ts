import type { BusinessInfo } from "@/lib/business-info";
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

export function localBusinessJsonLd(business: BusinessInfo) {
  const openingHours = Object.entries(business.hours || {})
    .filter(([, v]) => v)
    .map(([day, v]) => `${DAY_MAP[day]} ${v!.open}-${v!.close}`);

  return {
    "@context": "https://schema.org",
    "@type": "ToyStore",
    name: business.name,
    image: business.logo_url || undefined,
    telephone: business.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.district || undefined,
      addressCountry: "MN",
    },
    geo:
      business.latitude && business.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: business.latitude,
            longitude: business.longitude,
          }
        : undefined,
    openingHoursSpecification: openingHours,
    url: `${siteUrl()}/mn/store/next-plaza`,
    sameAs: [business.instagram_url, business.facebook_url].filter(Boolean),
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
  business: BusinessInfo
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
