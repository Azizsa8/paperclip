# AMADS Admin UI - Deployment Instructions

## Option 1: Vercel CLI (Recommended)

```bash
cd amads/ui
npm install
npm install -g vercel
vercel deploy --prod
```

## Option 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import from GitHub: `Azizsa8/paperclip`
3. Set Root Directory: `amads/ui`
4. Framework Preset: Next.js
5. Deploy

## Option 3: Railway (Alternative)

Add a new service to your Railway project pointing to the `amads/ui` directory.

## Environment Variables

Set these in your deployment platform:

```
NEXT_PUBLIC_PAPERCLIP_URL=https://paperclip-groq-production.up.railway.app
NEXT_PUBLIC_OPENCLAW_URL=https://openclaw-production-af70.up.railway.app
```

## Expected URL

After deployment: `https://amads-admin.vercel.app` or your custom domain
