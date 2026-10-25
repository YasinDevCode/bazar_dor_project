import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-7xl font-black text-green-800">404</p>

      <h1 className="mt-5 text-2xl font-bold">
        পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="mt-3 max-w-md text-gray-500">
        আপনি যে পণ্য বা পৃষ্ঠাটি খুঁজছেন, সেটি পাওয়া যাচ্ছে না।
      </p>

      <Link href="/" className="primary-button mt-6">
        হোম পেজে ফিরে যান
      </Link>
    </section>
  );
}