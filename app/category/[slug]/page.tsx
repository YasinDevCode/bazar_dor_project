import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SortableProducts from "@/components/sortable-products";
import { getCategories, getCategoryProducts } from "@/lib/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `ক্যাটাগরি: ${decodeURIComponent(slug)} | বাজার দর`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  let categories;
  let products;

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getCategoryProducts(decodedSlug),
    ]);
  } catch {
    throw new Error("ক্যাটাগরির তথ্য লোড করা যায়নি।");
  }

  const category = categories.find(
    (item) => item.slug === decodedSlug,
  );

  if (!category) {
    notFound();
  }

  return (
    <section className="container-page py-10">
      <p className="text-sm font-bold text-green-700">ক্যাটাগরি</p>
      <h1 className="section-title mt-2">{category.name}</h1>
      <p className="mb-6 mt-2 text-sm text-gray-500">
        এই ক্যাটাগরির পণ্য এবং মূল্য তুলনা করুন।
      </p>

      <SortableProducts products={products} />
    </section>
  );
}