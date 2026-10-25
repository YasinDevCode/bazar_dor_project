import { getCategories } from "@/lib/products";
import Navbar from "@/components/navbar";
import type { Category } from "@/types/product";

export default async function Header() {
  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("নেভিগেশনের ক্যাটাগরি লোড করা যায়নি:", error);
    categories = [];
  }

  return <Navbar categories={categories} />;
}
