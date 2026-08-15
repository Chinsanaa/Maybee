/**
 * Shared band/collection definitions used by the homepage pills, the shop
 * filter sidebar, the Gift Finder, and the dedicated budget/age collection
 * landing pages — one source so the URLs and labels never drift apart.
 */

export type AgeBand = {
  slug: string;
  labelMn: string;
  labelEn: string;
  introMn: string;
  introEn: string;
  minMonths: number;
  maxMonths: number | null;
};

export const AGE_BANDS: AgeBand[] = [
  {
    slug: "0-2",
    labelMn: "0-2 нас",
    labelEn: "0-2 yrs",
    minMonths: 0,
    maxMonths: 23,
    introMn: "0-2 насны нярай, багачуудад зориулсан аюулгүй, мэдрэхүйг хөгжүүлэх тоглоомууд.",
    introEn: "Safe, sensory-friendly toys for babies and toddlers aged 0-2.",
  },
  {
    slug: "2-3",
    labelMn: "2-3 нас",
    labelEn: "2-3 yrs",
    minMonths: 24,
    maxMonths: 35,
    introMn: "2-3 насны хүүхдэд тохирсон энгийн барих, дүрд тоглох тоглоомууд.",
    introEn: "Simple building and pretend-play toys suited to 2-3 year-olds.",
  },
  {
    slug: "3-5",
    labelMn: "3-5 нас",
    labelEn: "3-5 yrs",
    minMonths: 36,
    maxMonths: 59,
    introMn: "3-5 насны хүүхдийн төсөөлөл, бүтээлч чадварыг дэмжих тоглоомын сонголт.",
    introEn: "Toys that support imagination and creativity for 3-5 year-olds.",
  },
  {
    slug: "5-7",
    labelMn: "5-7 нас",
    labelEn: "5-7 yrs",
    minMonths: 60,
    maxMonths: 83,
    introMn: "5-7 насны хүүхдэд зориулсан оньсого, хөгжүүлэх, STEM тоглоомууд.",
    introEn: "Puzzles, STEM, and learning-focused toys for 5-7 year-olds.",
  },
  {
    slug: "7-10",
    labelMn: "7-10 нас",
    labelEn: "7-10 yrs",
    minMonths: 84,
    maxMonths: 119,
    introMn: "7-10 насны хүүхдэд зориулсан илүү нарийвчилсан барих, шинжлэх ухааны тоглоомууд.",
    introEn: "More advanced building and science toys for 7-10 year-olds.",
  },
  {
    slug: "10-plus",
    labelMn: "10+ нас",
    labelEn: "10+ yrs",
    minMonths: 120,
    maxMonths: null,
    introMn: "10 болон түүнээс дээш насны хүүхдэд зориулсан тоглоом, цуглуулга.",
    introEn: "Toys and collectibles for children 10 and up.",
  },
];

export type BudgetBand = {
  slug: string;
  labelMn: string;
  labelEn: string;
  introMn: string;
  introEn: string;
  maxPrice: number | null;
};

export const BUDGET_BANDS: BudgetBand[] = [
  {
    slug: "under-20000",
    labelMn: "20,000₮ хүртэл",
    labelEn: "Under 20,000₮",
    maxPrice: 20000,
    introMn: "20,000₮ хүртэлх төсөвт тохирох бяцхан бэлэг, тоглоомын сонголт.",
    introEn: "Small gifts and toys that fit a budget under 20,000₮.",
  },
  {
    slug: "under-30000",
    labelMn: "30,000₮ хүртэл",
    labelEn: "Under 30,000₮",
    maxPrice: 30000,
    introMn: "30,000₮ хүртэлх үнэтэй, өдөр тутмын бэлэгт тохиромжтой тоглоомууд.",
    introEn: "Everyday-gift-friendly toys priced under 30,000₮.",
  },
  {
    slug: "under-50000",
    labelMn: "50,000₮ хүртэл",
    labelEn: "Under 50,000₮",
    maxPrice: 50000,
    introMn: "50,000₮ хүртэлх төсөвт багтах, илүү дэлгэрэнгүй бэлгийн сонголт.",
    introEn: "A wider selection of gifts under 50,000₮.",
  },
  {
    slug: "under-100000",
    labelMn: "100,000₮ хүртэл",
    labelEn: "Under 100,000₮",
    maxPrice: 100000,
    introMn: "100,000₮ хүртэлх үнэтэй, онцгой бэлгийн сонголт.",
    introEn: "Special-occasion gifts under 100,000₮.",
  },
  {
    slug: "premium",
    labelMn: "Дээд зэрэглэлийн бэлэг",
    labelEn: "Premium Gifts",
    maxPrice: null,
    introMn: "Онцгой баярт зориулсан дээд зэрэглэлийн тоглоом, бэлгийн сонголт.",
    introEn: "Premium toys and gifts for special occasions.",
  },
];

export type InterestTag = { value: string; labelMn: string; labelEn: string };

export const INTEREST_TAGS: InterestTag[] = [
  { value: "barikh", labelMn: "Барих", labelEn: "Building" },
  { value: "buteelch", labelMn: "Бүтээлч", labelEn: "Creative" },
  { value: "teevriin-heregsel", labelMn: "Тээврийн хэрэгсэл", labelEn: "Vehicles" },
  { value: "huukheldei", labelMn: "Хүүхэлдэй", labelEn: "Dolls" },
  { value: "zoolon", labelMn: "Зөөлөн тоглоом", labelEn: "Plush" },
  { value: "gadaa-toglokh", labelMn: "Гадаа тоглох", labelEn: "Outdoor" },
  { value: "stem", labelMn: "STEM сургалт", labelEn: "STEM / Learning" },
  { value: "onisogo", labelMn: "Оньсого", labelEn: "Puzzles & Games" },
];

export function getAgeBandBySlug(slug: string) {
  return AGE_BANDS.find((b) => b.slug === slug) ?? null;
}

export function getBudgetBandBySlug(slug: string) {
  return BUDGET_BANDS.find((b) => b.slug === slug) ?? null;
}
