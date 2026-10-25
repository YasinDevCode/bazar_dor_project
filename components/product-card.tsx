import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatBanglaNumber } from "@/lib/format";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const previousPrice = product.previousPrice ?? product.price;
  const change =
    previousPrice > 0
      ? ((product.price - previousPrice) / previousPrice) * 100
      : 0;
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const changeLabel =
    direction === "up"
      ? `▲ ${formatBanglaNumber(Math.abs(change))}%`
      : direction === "down"
        ? `▼ ${formatBanglaNumber(Math.abs(change))}%`
        : `—${formatBanglaNumber(0)}%`;

  return (
    <article className="surface overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
      <Link
        href={`/product/${encodeURIComponent(product.slug)}`}
        aria-label={`${product.name} পণ্যের বিস্তারিত দেখুন`}
        className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
      >
        <div className="flex h-36 items-center justify-center bg-[#f0f5ee] p-4 sm:h-44">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={180}
              height={150}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-6xl" aria-hidden="true">
              {product.emoji}
            </span>
          )}
        </div>

        <div className="flex h-[calc(100%-9rem)] flex-col p-4 sm:h-[calc(100%-11rem)]">
          <h3 className="line-clamp-2 min-h-12 font-bold">{product.name}</h3>
          <p className="mt-1 text-xs text-gray-500">প্রতি {product.unit}</p>

          <div className="mt-4 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-600">আজকের দাম</p>
              <p className="mt-1 text-base font-extrabold text-red-700 sm:text-lg">
                {formatBanglaNumber(product.price)} টাকা
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${
                direction === "up"
                  ? "bg-green-100 text-green-800"
                  : direction === "down"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {changeLabel}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}