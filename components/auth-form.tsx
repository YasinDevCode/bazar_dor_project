"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Props = {
  mode: "signin" | "signup";
  googleEnabled: boolean;
  githubEnabled: boolean;
};

export default function AuthForm({
  mode,
  googleEnabled,
  githubEnabled,
}: Props) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (isSignup && !name) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      toast.error("পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের মধ্যে হতে হবে।");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignup) {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/",
        });
        if (result.error) {
          throw new Error(result.error.message);
        }

        toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
        router.replace("/signin");
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (result.error) {
          throw new Error(result.error.message);
        }

        toast.success("সফলভাবে সাইন ইন হয়েছে।");
        router.replace("/");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialSignIn(
    provider: "google" | "github",
    enabled: boolean,
  ) {
    if (!enabled) {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} sign-in চালু করতে OAuth credentials কনফিগার করুন।`,
      );
      return;
    }

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "সামাজিক সাইন-ইন করা যায়নি। আবার চেষ্টা করুন।",
      );
    }
  }

  return (
    <section className="container-page flex min-h-[65vh] items-center justify-center py-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="surface w-full max-w-md p-6 sm:p-8"
      >
        <h1 className="text-2xl font-black">
          {isSignup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isSignup
            ? "বাজার দর ব্যবহার করতে আপনার তথ্য দিয়ে নিবন্ধন করুন।"
            : "আপনার অ্যাকাউন্টে প্রবেশ করতে ইমেইল ও পাসওয়ার্ড দিন।"}
        </p>

        {isSignup && (
          <label className="mt-5 block text-sm font-semibold">
            নাম
            <input
              name="name"
              required
              autoComplete="name"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal focus:border-green-700 focus:outline-none"
              placeholder="আপনার সম্পূর্ণ নাম"
            />
          </label>
        )}

        <label className="mt-5 block text-sm font-semibold">
          ইমেইল
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal focus:border-green-700 focus:outline-none"
            placeholder="name@example.com"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold">
          পাসওয়ার্ড
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete={isSignup ? "new-password" : "current-password"}
            disabled={isSubmitting}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 font-normal focus:border-green-700 focus:outline-none"
            placeholder="৮–১২৮ অক্ষর"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button mt-6 w-full disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
              প্রক্রিয়াধীন…
            </span>
          ) : isSignup ? (
            "সাইন আপ"
          ) : (
            "সাইন ইন"
          )}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          অথবা
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSocialSignIn("google", googleEnabled)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            Google দিয়ে চালিয়ে যান
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSocialSignIn("github", githubEnabled)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="mt-5 text-sm text-gray-600">
          {isSignup ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "নতুন ব্যবহারকারী?"}{" "}
          <Link
            className="font-bold text-green-800 underline"
            href={isSignup ? "/signin" : "/signup"}
          >
            {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
          </Link>
        </p>
      </form>
    </section>
  );
}
