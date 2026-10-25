import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#123e2b] py-10 text-white">
      <div className="container-page grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-extrabold">বাজার দর</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-green-100">
            নিত্যপ্রয়োজনীয় পণ্যের দাম দেখা ও তুলনা করার জন্য একটি সহজ
            ওয়েবসাইট।
          </p>
        </div>

        <div className="sm:text-right">
          <h3 className="font-bold">দ্রুত লিংক</h3>
          <div className="mt-3 flex gap-4 text-sm sm:justify-end">
            <Link href="/">হোম</Link>
            <Link href="/signin">লগইন</Link>
            <Link href="/signup">নিবন্ধন</Link>
          </div>
        </div>
      </div>

      <div className="container-page mt-8 border-t border-white/20 pt-5 text-xs text-green-100">
        © বাজার দর। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}