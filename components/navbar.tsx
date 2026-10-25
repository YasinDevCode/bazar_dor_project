"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { Category } from "@/types/product";

export default function Navbar({
  categories,
}: {
  categories: Category[];
}) {
  const { data: session, isPending } = authClient.useSession();
  const [today, setToday] = useState("");

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
    } catch {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setToday(new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="border-b border-green-100 bg-white">
      <div className="container-page flex min-h-20 items-center justify-between gap-4 py-3">
        <Link href="/" className="shrink-0 text-green-950">
          <span className="block text-xl font-black sm:text-2xl">
            🛒 বাজার দর
          </span>
          <span className="mt-1 block min-h-4 text-xs text-gray-500">
            {today}
          </span>
        </Link>

        {isPending ? (
          <div
            aria-label="অ্যাকাউন্টের অবস্থা লোড হচ্ছে"
            className="flex shrink-0 animate-pulse gap-2"
          >
            <span className="h-9 w-16 rounded-lg bg-gray-200" />
            <span className="h-9 w-20 rounded-lg bg-gray-200" />
          </div>
        ) : session?.user ? (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/profile"
              className="max-w-32 truncate rounded-lg px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-50"
            >
              {session.user.name || "প্রোফাইল"}
            </Link>
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              সাইন আউট
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/signin"
              className="rounded-lg px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-50"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-green-800 px-3 py-2 text-sm font-bold text-white hover:bg-green-900"
            >
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      <Suspense fallback={<CategoryLinksFallback categories={categories} />}>
        <CategoryLinks categories={categories} />
      </Suspense>
    </header>
  );
}

function CategoryLinksFallback({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="ক্যাটাগরি" className="border-t border-gray-100">
      <div className="container-page flex gap-2 overflow-x-auto py-2">
        <CategoryLink href="/#সব-পণ্য">সব পণ্য</CategoryLink>
        {categories.map((category) => (
          <CategoryLink
            key={category.slug}
            href={`/category/${encodeURIComponent(category.slug)}`}
          >
            {category.name}
          </CategoryLink>
        ))}
      </div>
    </nav>
  );
}

function CategoryLinks({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="ক্যাটাগরি" className="border-t border-gray-100">
      <div className="container-page flex gap-2 overflow-x-auto py-2">
        <CategoryLink href="/#সব-পণ্য" active={pathname === "/"}>
          সব পণ্য
        </CategoryLink>
        {categories.map((category) => {
          const href = `/category/${encodeURIComponent(category.slug)}`;
          const isActive = pathname === href;

          return (
            <CategoryLink key={category.slug} href={href} active={isActive}>
              {category.name}
            </CategoryLink>
          );
        })}
      </div>
    </nav>
  );
}

function CategoryLink({
  href,
  active = false,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
        active
          ? "bg-green-800 text-white"
          : "text-gray-700 hover:bg-green-50"
      }`}
    >
      {children}
    </Link>
  );
}
