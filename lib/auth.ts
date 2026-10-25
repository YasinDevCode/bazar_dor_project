import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";

const databasePath =
  process.env.AUTH_DATABASE_PATH ??
  path.join(process.cwd(), "data", "auth.sqlite");
const secret =
  process.env.BETTER_AUTH_SECRET ??
  "bazar-dor-default-dev-secret-change-in-production";

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn(
    "BETTER_AUTH_SECRET is not set. Falling back to a local default secret.",
  );
}

mkdirSync(path.dirname(databasePath), { recursive: true });

const googleCredentials =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    : undefined;

const githubCredentials =
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }
    : undefined;

export const auth = betterAuth({
  appName: "বাজার দর",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret,
  database: new Database(databasePath),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    ...(googleCredentials ? { google: googleCredentials } : {}),
    ...(githubCredentials ? { github: githubCredentials } : {}),
  },
});
