import ProductCard from "@/components/product-card";
import type { Product } from "@/types/product";

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) {
    return (
      <div className="surface p-10 text-center">
        <p className="text-lg font-bold">কোনো পণ্য পাওয়া যায়নি</p>
        <p className="mt-2 text-sm text-gray-500">
          API-এর data বা category নির্বাচন পরীক্ষা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  );
}