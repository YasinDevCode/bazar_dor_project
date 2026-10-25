import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductGrid from "@/components/product-grid";
import type { Product } from "@/types/product";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let product;

  try {
    product = await getProduct(decodedSlug);
  } catch {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  if (!product) {
    notFound();
  }

  const minPrice = product.minPrice ?? product.price;
  const maxPrice = product.maxPrice ?? product.price;
  const averagePrice = product.averagePrice ?? product.price;
  const marketSummary = product.markets.length
    ? `${product.markets.length.toLocaleString("bn-BD")}টি বাজারে আজকের দাম ${formatPrice(minPrice)} থেকে ${formatPrice(maxPrice)}।`
    : "এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।";
  let relatedProducts: Product[] = [];

  try {
    relatedProducts = (await getProducts(product.categorySlug))
      .filter((item) => item.slug !== product.slug)
      .slice(0, 4);
  } catch (error) {
    console.error("সম্পর্কিত পণ্য লোড করা যায়নি:", error);
  }

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-800">
          হোম
        </Link>
        {" / "}
        <Link
          href={`/category/${encodeURIComponent(product.categorySlug)}`}
          className="hover:text-green-800"
        >
          {product.category}
        </Link>
        {" / "}
        <span>{product.name}</span>
      </div>

      <section className="surface overflow-hidden">
        <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[220px_1fr] md:items-center">
          <div className="flex h-44 items-center justify-center rounded-2xl bg-[#f0f5ee] p-6 sm:h-52">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                width={180}
                height={160}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-7xl" aria-hidden="true">
                {product.emoji}
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
                {product.category}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                প্রতি {product.unit}
              </span>
            </div>
            <h1 className="mt-3 flex items-center gap-3 text-3xl font-black sm:text-4xl">
              <span aria-hidden="true">{product.emoji}</span>
              {product.name}
            </h1>
            <p className="mt-3 leading-7 text-gray-600">{marketSummary}</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {product.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="section-title mb-4">দামের সারাংশ</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "সর্বনিম্ন দাম", value: minPrice },
            { label: "সর্বোচ্চ দাম", value: maxPrice },
            { label: "গড় দাম", value: averagePrice },
          ].map(({ label, value }) => (
            <div key={label} className="surface p-5">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-2 text-2xl font-black text-green-800">
                {formatPrice(value)}
              </p>
              <p className="mt-1 text-xs text-gray-500">প্রতি {product.unit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="section-title">বাজারভিত্তিক আজকের দাম</h2>
          <p className="mt-2 text-sm text-gray-500">
            প্রতিটি বাজারে পাওয়া সর্বনিম্ন ও সর্বোচ্চ দাম দেখানো হয়েছে।
          </p>
        </div>

        {product.markets.length ? (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white sm:block">
              <table className="w-full text-left">
                <thead className="bg-green-50 text-sm text-green-950">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-bold">
                      বাজার
                    </th>
                    <th scope="col" className="px-5 py-3 font-bold">
                      বিভাগ
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-bold">
                      সর্বনিম্ন
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-bold">
                      সর্বোচ্চ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.markets.map((market) => (
                    <tr key={`${market.division}-${market.name}`}>
                      <td className="px-5 py-4 font-semibold">
                        {market.name}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {market.division || "—"}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold">
                        {formatPrice(market.minPrice)}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold">
                        {formatPrice(market.maxPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="grid gap-3 sm:hidden">
              {product.markets.map((market) => (
                <li
                  key={`${market.division}-${market.name}`}
                  className="surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{market.name}</h3>
                      {market.division && (
                        <p className="mt-1 text-sm text-gray-500">
                          {market.division}
                        </p>
                      )}
                    </div>
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">
                      প্রতি {product.unit}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-xs text-gray-500">সর্বনিম্ন</p>
                      <p className="mt-1 font-bold">
                        {formatPrice(market.minPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">সর্বোচ্চ</p>
                      <p className="mt-1 font-bold">
                        {formatPrice(market.maxPrice)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="surface p-6 text-sm text-gray-600">
            এই পণ্যের জন্য বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title mb-5">সম্পর্কিত পণ্য</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
