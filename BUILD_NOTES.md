# Build Notes

## Local Development

To run the app locally:

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials to `.env.local`
3. Run `npm install`
4. Run `npm run dev`

## Production Build

**Important:** The production build requires valid Supabase environment variables.

### For Vercel Deployment:

1. Push your code to GitHub
2. Import project in Vercel
3. **Add environment variables BEFORE deploying:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Why Build Fails Locally:

If you see build errors like "Invalid supabaseUrl", it's because:
- The `.env.local` file has placeholder values
- Next.js tries to pre-render pages during build
- Supabase client needs valid URLs

**Solution:** Either:
1. Add real Supabase credentials to `.env.local` before building
2. Deploy directly to Vercel with environment variables set there

### Testing Build Locally:

```bash
# Make sure .env.local has real Supabase credentials
npm run build
npm run start
```

## Vercel Deployment (Recommended Approach):

Don't worry about local builds. Just:
1. Push to GitHub
2. Set environment variables in Vercel dashboard
3. Let Vercel build with the correct credentials
4. Your app will work perfectly

The build process on Vercel will succeed because you'll provide real environment variables there.
