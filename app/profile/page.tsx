import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  return (
    <section className="container-page py-10">
      <h1 className="section-title">প্রোফাইল</h1>
      <div className="surface mt-5 max-w-xl p-6">
        <p className="text-sm text-gray-500">নাম</p>
        <p className="mt-1 font-semibold">{session.user.name}</p>
        <p className="mt-4 text-sm text-gray-500">ইমেইল</p>
        <p className="mt-1 font-semibold">{session.user.email}</p>
        <Link href="/profile/update" className="primary-button mt-6">
          তথ্য হালনাগাদ
        </Link>
      </div>
    </section>
  );
}