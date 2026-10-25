import Image from "next/image";
import Link from "next/link";
import ProductGrid from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let apiError = false;

  try {
    products = await getProducts();
  } catch {
    apiError = true;
  }

  const risers = [...products]
    .filter(
      (product) =>
        product.previousPrice !== undefined &&
        product.previousPrice > 0 &&
        product.price > product.previousPrice,
    )
    .sort(
      (a, b) =>
        b.price -
        (b.previousPrice ?? b.price) -
        (a.price - (a.previousPrice ?? a.price)),
    )
    .slice(0, 6);

  const fallers = [...products]
    .filter(
      (product) =>
        product.previousPrice !== undefined &&
        product.previousPrice > 0 &&
        product.price < product.previousPrice,
    )
    .sort(
      (a, b) =>
        a.price -
        (a.previousPrice ?? a.price) -
        (b.price - (b.previousPrice ?? b.price)),
    )
    .slice(0, 6);

  return (
    <>
      <section className="overflow-hidden bg-[#edf5eb]">
        <div className="container-page grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-green-800">
              আপনার প্রতিদিনের বাজার সহকারী
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight text-[#153d2b] md:text-6xl">
              বাজারের সঠিক দর,
              <br />
              <span className="text-[#218052]">এক জায়গায়</span>
            </h1>

            <p className="mt-5 max-w-lg leading-8 text-gray-600">
              নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন, বিভিন্ন পণ্যের মূল্য তুলনা
              করুন এবং বাজার সম্পর্কে সিদ্ধান্ত নিন সহজে।
            </p>

            <Link href="#সব-পণ্য" className="primary-button mt-7">
              সব পণ্য দেখুন →
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <Image
              src="/images/bazar-hero.png"
              alt="বাজারের পণ্যের ঝুড়ি"
              width={600}
              height={480}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      <div className="container-page py-12">
        {apiError && (
          <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            এখন API থেকে পণ্যের তথ্য পাওয়া যাচ্ছে না। API URL এবং response
            format পরীক্ষা করুন।
          </div>
        )}

        <section className="mb-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-green-700">PRICE TREND</p>
              <h2 className="section-title mt-1">যেসব পণ্যের দাম বেড়েছে</h2>
            </div>
          </div>
          {risers.length ? (
            <ProductGrid products={risers} />
          ) : (
            <p className="surface p-5 text-sm text-gray-500">
              দাম বৃদ্ধির তুলনামূলক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <section className="mb-12">
          <div className="mb-5">
            <p className="text-sm font-bold text-green-700">PRICE TREND</p>
            <h2 className="section-title mt-1">যেসব পণ্যের দাম কমেছে</h2>
          </div>
          {fallers.length ? (
            <ProductGrid products={fallers} />
          ) : (
            <p className="surface p-5 text-sm text-gray-500">
              দাম কমার তুলনামূলক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <section id="সব-পণ্য" className="scroll-mt-8">
          <div className="mb-5">
            <p className="text-sm font-bold text-green-700">
              EXPLORE PRODUCTS
            </p>
            <h2 className="section-title mt-1">সব পণ্য</h2>
            <p className="mt-2 text-sm text-gray-500">
              প্রয়োজনীয় পণ্য খুঁজে দেখুন।
            </p>
          </div>

          <ProductGrid products={products} />
        </section>
      </div>
    </>
  );
}
