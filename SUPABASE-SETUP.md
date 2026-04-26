# Supabase Setup for Diesel Injecteurs

## 1. Create Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Name it `diesel-injecteurs` (or any name)
4. Choose a region close to your users (e.g., Frankfurt for Europe)
5. Wait for the project to be created

## 2. Get API Credentials
After the project is created:
1. Go to Project Settings → API
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Run the Schema
1. Go to SQL Editor → New query
2. Copy contents from `supabase-schema.sql`
3. Run the query

## 4. Update Environment Variables
Add to your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 5. Install Dependencies
```bash
npm install
```

## 6. Sync Products from PrestaShop
Run this API endpoint once to sync all products:
```bash
curl -X POST http://localhost:3000/api/sync
```

Or use a browser/curl to trigger the sync.

This will:
1. Fetch all products from PrestaShop (in batches)
2. Store them in Supabase
3. Takes ~2-5 minutes for 9000+ products

## 7. How It Works Now
- Products are stored in Supabase (permanent, fast)
- API queries Supabase (fast SQL queries)
- No more waiting for PrestaShop API
- No more timeouts

## 8. Optional: Auto-Sync
To keep products updated, you can:
- Run the sync endpoint daily (cron job)
- Or add a webhook in PrestaShop to trigger sync
- Or use Supabase Edge Functions

## Benefits
- ⚡ Instant queries (no waiting)
- 🔍 Fast filtering (SQL indexes)
- 💾 Persistent storage
- 📊 Can handle 10k+ products easily
- 🔧 Easy to add search, pagination, etc.
