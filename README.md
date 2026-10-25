# বাজার দর

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `BETTER_AUTH_SECRET` to a
   random secret of at least 32 characters. `BETTER_AUTH_URL` should match the
   app's origin.
3. Create the SQLite auth tables with `npm run auth:migrate`.
4. Start Next.js with `npm run dev`.

The default database is `./data/auth.sqlite`. Set `AUTH_DATABASE_PATH` to
change it. Keep the SQLite file on persistent storage in deployments; ephemeral
serverless filesystems do not preserve accounts or sessions.

Email/password sign-in and registration are enabled. Google and GitHub
sign-in are enabled when their client ID and secret are set in `.env.local`.
Configure these callback URLs in the OAuth provider consoles:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

For a deployed site, use the deployed origin in `BETTER_AUTH_URL` and register
the corresponding deployed callback URLs with the providers. Do not commit
`.env.local` or OAuth secrets. Set `BETTER_AUTH_SECRET` in the deployment
environment before building and running the production app.

## Build and lint

```bash
npm run lint
npm run build
```

# bazar_dor_project
