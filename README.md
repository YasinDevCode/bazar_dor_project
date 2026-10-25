<div align="center">

# 🛒 বাজার দর · BazarDor

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম, বাজারভিত্তিক তুলনা ও দৈনিক মূল্য-পরিবর্তন এক জায়গায়।

</div>

## ✨ প্রধান বৈশিষ্ট্য

1. **লাইভ বাজারদর** — একাধিক API source থেকে পণ্যের বর্তমান দাম, আগের দিনের পরিবর্তন ও বাজারভিত্তিক সর্বনিম্ন/সর্বোচ্চ দাম।
2. **পণ্য খোঁজা ও সাজানো** — ক্যাটাগরি অনুযায়ী পণ্য দেখা এবং দাম কম থেকে বেশি বা বেশি থেকে কম সাজানো।
3. **বিস্তারিত পণ্য পৃষ্ঠা** — পণ্যের গড়/সর্বনিম্ন/সর্বোচ্চ দাম এবং বিভিন্ন বাজারের দাম একসঙ্গে দেখা।
4. **দৈনিক মূল্য ticker** — বাংলা সংখ্যায় দাম ও ঊর্ধ্ব/নিম্নমুখী পরিবর্তনের চলমান ticker।
5. **ব্যবহারকারী অ্যাকাউন্ট** — Better Auth-ভিত্তিক email/password নিবন্ধন ও sign-in, ঐচ্ছিক Google/GitHub OAuth, profile দেখা ও নাম হালনাগাদ।

## 🧰 প্রযুক্তি

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4, Lucide React, Sonner
- Better Auth 1.7 with SQLite (`better-sqlite3`)
- Programming Hero Bazar Dor API with two fallback API sources

## 🚀 Local setup

প্রয়োজন: Node.js 22+ এবং npm।

```bash
npm install
Copy-Item .env.example .env.local
```

`.env.local`-এ `BETTER_AUTH_SECRET`-কে কমপক্ষে ৩২ অক্ষরের একটি গোপন random value দিয়ে বদলান। `BETTER_AUTH_URL` local app origin (`http://localhost:3000`) হতে হবে।

```bash
npm run auth:migrate
npm run dev
```

তারপর [http://localhost:3000](http://localhost:3000) খুলুন। SQLite database ডিফল্টভাবে `./data/auth.sqlite`-এ তৈরি হয়; `AUTH_DATABASE_PATH` দিয়ে এর অবস্থান পরিবর্তন করা যায়। Production deployment-এ persistent disk ব্যবহার করুন—ephemeral serverless filesystem-এ account/session সংরক্ষিত থাকবে না।

### Social sign-in (optional)

Google বা GitHub console থেকে OAuth client তৈরি করে `.env.local`-এ সংশ্লিষ্ট client ID ও secret দিন:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Local callback URL:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Production-এ `BETTER_AUTH_URL` ও OAuth callback URL-এ deployed origin ব্যবহার করুন। `.env.local`, database file বা OAuth secret commit করবেন না। Production build/run-এর আগে deployment environment-এ `BETTER_AUTH_SECRET` সেট করুন।

## 🧪 যাচাই

```bash
npm run lint
npm run build
```
