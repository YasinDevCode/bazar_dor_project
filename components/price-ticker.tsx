import Link from "next/link";
import { formatBanglaNumber, formatPrice } from "@/lib/format";
import { getProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export default async function PriceTicker() {
  let products: Product[];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("দামের ticker-এর পণ্য লোড করা যায়নি:", error);

    return (
      <div
        role="status"
        className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900"
      >
        এই মুহূর্তে দামের তথ্য পাওয়া যাচ্ছে না।
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="পণ্যের সর্বশেষ দাম"
      className="overflow-hidden border-b border-green-100 bg-green-50"
    >
      <div className="price-ticker-track flex w-max">
        {[false, true].map((isDuplicate) => (
          <ul
            key={String(isDuplicate)}
            aria-hidden={isDuplicate}
            className="flex shrink-0 items-center"
          >
            {products.map((product) => {
              const previousPrice = product.previousPrice ?? product.price;
              const change =
                previousPrice > 0
                  ? ((product.price - previousPrice) / previousPrice) * 100
                  : 0;
              const direction =
                change > 0 ? "up" : change < 0 ? "down" : "flat";

              return (
                <li key={product.id} className="px-5 py-2.5">
                  <Link
                    href={`/product/${encodeURIComponent(product.slug)}`}
                    tabIndex={isDuplicate ? -1 : undefined}
                    className="flex items-center gap-2 whitespace-nowrap text-sm"
                  >
                    <span aria-hidden="true" className="text-base">
                      {product.emoji}
                    </span>
                    <span className="font-semibold text-green-950">
                      {product.name}
                    </span>
                    <span className="text-gray-700">
                      {formatPrice(product.price)}/{product.unit}
                    </span>
                    <span
                      className={
                        direction === "up"
                          ? "font-bold text-red-700"
                          : direction === "down"
                            ? "font-bold text-green-700"
                            : "font-bold text-gray-500"
                      }
                    >
                      {direction === "up"
                        ? "▲"
                        : direction === "down"
                          ? "▼"
                          : "→"}{" "}
                      {formatBanglaNumber(Math.abs(change))}%
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </section>
  );
}