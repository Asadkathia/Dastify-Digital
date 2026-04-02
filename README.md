This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project can deploy on Vercel, with one important condition:
- Do not use local SQLite (`file:./payload.db`) in production.
- Use a remote Postgres database (recommended: Neon) in `DATABASE_URI`.

Required production environment variables:
- `PAYLOAD_SECRET`
- `PREVIEW_SECRET`
- `DATABASE_URI` (`postgres://...` or `postgresql://...`, not `file:`)
- `NEXT_PUBLIC_SITE_URL` (your Vercel domain)

### Create remote DB (Neon)

```bash
# Use Neon dashboard to create a project + database
# Copy the pooled connection string and set it as DATABASE_URI
# Example:
# DATABASE_URI=postgresql://<user>:<pass>@<host>/<db>?sslmode=require
```

### One-command deployment

From project root:

```bash
npm run deploy:vercel
```

The script:
1. Validates required env vars.
2. Runs DB migrations (`npm run db:migrate`).
3. Builds the app (`npm run build`).
4. Runs `vercel pull` and `vercel deploy --prod`.

### First-time setup

```bash
vercel link
vercel env add PAYLOAD_SECRET production
vercel env add PREVIEW_SECRET production
vercel env add DATABASE_URI production
vercel env add NEXT_PUBLIC_SITE_URL production
```

# Dastify-Digital
