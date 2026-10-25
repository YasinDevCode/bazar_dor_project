"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function ProfileUpdateForm({
  currentName,
}: {
  currentName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedName = name.trim();

    if (!updatedName) {
      toast.error("নাম লিখুন।");
      return;
    }

    if (updatedName.length > 100) {
      toast.error("নাম ১০০ অক্ষরের বেশি হতে পারবে না।");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.updateUser({ name: updatedName });
      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success("আপনার তথ্য হালনাগাদ হয়েছে।");
      router.replace("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "তথ্য হালনাগাদ করা যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className="surface mt-5 max-w-xl p-6"
    >
      <label htmlFor="profile-name" className="block text-sm font-semibold">
        নাম
      </label>
      <input
        id="profile-name"
        name="name"
        type="text"
        autoComplete="name"
        maxLength={100}
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        disabled={isSubmitting}
        className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:border-green-700 focus:outline-none"
      />
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? "হালনাগাদ হচ্ছে…" : "তথ্য হালনাগাদ"}
        </button>
        <Link
          href="/profile"
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
        >
          বাতিল
        </Link>
      </div>
    </form>
  );
}
