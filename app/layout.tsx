import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PriceTicker from "@/components/price-ticker";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "বাজার দর | প্রতিদিনের বাজারদর",
  description:
    "প্রয়োজনীয় পণ্যের বাজারদর, দামের তুলনা এবং ক্যাটাগরিভিত্তিক তথ্য দেখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <Header />
        <PriceTicker />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}