import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileUpdateForm from "@/components/profile-update-form";
import { auth } from "@/lib/auth";

export default async function UpdateProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }

  return (
    <section className="container-page py-10">
      <h1 className="section-title">তথ্য হালনাগাদ</h1>
      <p className="mt-2 text-gray-600">
        আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।
      </p>
      <ProfileUpdateForm currentName={session.user.name} />
    </section>
  );
}
