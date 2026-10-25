"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@/types/product";

type SortOption = "default" | "low" | "high";

export default function SortableProducts({
  products,
}: {
  products: Product[];
}) {
  const [sort, setSort] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const copy = [...products];

    switch (sort) {
      case "low":
        return copy.sort((a, b) => Number(a.price) - Number(b.price));
      case "high":
        return copy.sort((a, b) => Number(b.price) - Number(a.price));
      default:
        return copy;
    }
  }, [products, sort]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          মোট পণ্য: {products.length.toLocaleString("bn-BD")}
        </p>

        <label className="flex items-center gap-2 text-sm">
          <span>সাজান</span>
          <span className="relative">
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </span>
        </label>
      </div>

      <ProductGrid products={sortedProducts} />
    </div>
  );
}