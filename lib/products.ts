import type { Category, MarketPrice, Product } from "@/types/product";

const API_URLS = [
  process.env.MAIN_API_URL ??
    "https://openapi.programming-hero.com/api/bazardor",
  process.env.BASE_URL_1 ??
    "https://api.api-store.workers.dev/api/bazardor",
  process.env.BASE_URL_2 ??
    "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchApi<T>(path: string): Promise<T> {
  let lastError: unknown;

  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}${path}`,
        { next: { revalidate: 60 } },
      );

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `সব API source থেকে data পাওয়া যায়নি: ${String(lastError)}`,
  );
}

function unwrapArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value as Record<string, unknown>[];
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;

    for (const key of ["data", "products", "categories", "result"]) {
      const nested = obj[key];

      if (Array.isArray(nested)) {
        return nested as Record<string, unknown>[];
      }
    }
  }

  return [];
}

function toNumber(value: unknown, fallback = 0): number {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function toBengaliUnit(value: unknown): string {
  const unit = String(value ?? "কেজি").trim().toLowerCase();
  const units: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    kilograms: "কেজি",
    l: "লিটার",
    liter: "লিটার",
    litre: "লিটার",
    liters: "লিটার",
    litres: "লিটার",
    dozen: "ডজন",
    dz: "ডজন",
    pc: "পিস",
    pcs: "পিস",
    piece: "পিস",
    pieces: "পিস",
  };

  return units[unit] ?? String(value ?? "কেজি");
}

function toProduct(item: Record<string, unknown>): Product {
  const id = String(item.id ?? item._id ?? item.slug ?? "");
  const name = String(
    item.nameBn ?? item.name ?? item.title ?? "নাম পাওয়া যায়নি",
  );
  const category = String(
    item.categoryNameBn ?? item.categoryName ?? item.category ?? "অন্যান্য",
  );
  const slug = String(item.slug ?? id);
  const price = toNumber(item.price ?? item.today ?? item.averagePrice);
  const markets = Array.isArray(item.markets)
    ? (item.markets as Record<string, unknown>[])
    : [];
  const marketMinPrices = markets
    .map((market) => toNumber(market.min, Number.NaN))
    .filter(Number.isFinite);
  const marketMaxPrices = markets
    .map((market) => toNumber(market.max, Number.NaN))
    .filter(Number.isFinite);
  const marketPrices: MarketPrice[] = markets.flatMap((market) => {
    const minPrice = toNumber(market.min, Number.NaN);
    const maxPrice = toNumber(market.max, Number.NaN);
    if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)) {
      return [];
    }

    return [
      {
        name: String(market.market ?? market.name ?? "বাজার"),
        division: String(market.division ?? ""),
        minPrice,
        maxPrice,
      },
    ];
  });
  const image = String(item.image ?? item.imageUrl ?? item.photo ?? "");
  const emoji = String(
    item.categoryIcon ??
      (image.startsWith("https://") ||
      image.startsWith("http://") ||
      image.startsWith("/")
        ? "🛒"
        : image || "🛒"),
  );

  return {
    id,
    slug,
    name,
    category,
    categorySlug: String(
      item.categorySlug ??
        item.category ??
        category.toLowerCase().replace(/\s+/g, "-"),
    ),
    emoji,
    image: image.startsWith("https://") ||
      image.startsWith("http://") ||
      image.startsWith("/")
      ? image
      : "",
    price,
    minPrice: toNumber(
      item.minPrice ?? item.minimumPrice,
      marketMinPrices.length ? Math.min(...marketMinPrices) : price,
    ),
    maxPrice: toNumber(
      item.maxPrice ?? item.maximumPrice,
      marketMaxPrices.length ? Math.max(...marketMaxPrices) : price,
    ),
    averagePrice: toNumber(item.averagePrice ?? item.price ?? item.today),
    previousPrice: toNumber(
      item.previousPrice ?? item.yesterday ?? item.oldPrice,
    ),
    unit: toBengaliUnit(item.unit),
    description: String(item.description ?? "পণ্যের বিস্তারিত তথ্য।"),
    markets: marketPrices,
  };
}

export async function getProducts(
  category?: string,
): Promise<Product[]> {
  const query = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";

  const raw = await fetchApi<unknown>(query);
  return unwrapArray(raw).map(toProduct);
}

export async function getProduct(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(
    (product) => product.slug === slug || product.id === slug,
  );
}

export async function getCategories(): Promise<Category[]> {
  const raw = await fetchApi<unknown>("/categories");

  return unwrapArray(raw).map((item) => {
    const name = String(
      item.nameBn ?? item.name ?? item.title ?? "অন্যান্য",
    );

    return {
      name,
      slug: String(
        item.slug ?? item.id ?? name.toLowerCase().replace(/\s+/g, "-"),
      ),
    };
  });
}

export async function getCategoryProducts(
  slug: string,
): Promise<Product[]> {
  return getProducts(slug);
}