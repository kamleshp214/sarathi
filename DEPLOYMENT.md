# Deployment Guide

## Important: Environment Variables Required

**Before deploying, you MUST set up environment variables in Vercel.** The build will fail without valid Supabase credentials.

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps and offers a generous free tier.

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a GitHub repository

### Step 1: Push to GitHub

If you haven't already:

```bash
cd sarathi
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/kamleshp214/sarathi.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Configure Environment Variables

Before deploying, add your environment variables:

1. In the Vercel project setup, scroll to **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
```

3. Make sure to add them for **Production**, **Preview**, and **Development** environments

### Step 4: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like `https://sarathi-xyz.vercel.app`

### Step 5: Test Production

1. Visit your Vercel URL
2. Log in with your Supabase credentials
3. Test all features:
   - Add a driver
   - Mark attendance
   - Add advance
   - View settlement

### Step 6: Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

## Deploy to Other Platforms

### Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Connect to GitHub and select repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in **Site settings** → **Environment variables**
7. Deploy

### Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway auto-detects Next.js
5. Add environment variables in **Variables** tab
6. Deploy

### Self-Hosted (VPS)

Requirements:
- Ubuntu 20.04+ or similar
- Node.js 18+
- PM2 or similar process manager
- Nginx (optional, for reverse proxy)

```bash
# Clone repository
git clone https://github.com/yourusername/sarathi.git
cd sarathi

# Install dependencies
npm install

# Create .env.local with your Supabase credentials
nano .env.local

# Build for production
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "sarathi" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

Configure Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Login works
- [ ] Can add drivers
- [ ] Can mark attendance
- [ ] Calendar updates in real-time
- [ ] Can add advances
- [ ] Settlement calculation is correct
- [ ] Can mark settlement as paid
- [ ] Mobile responsive (test on phone)
- [ ] All environment variables are set
- [ ] HTTPS is enabled (automatic on Vercel)

## Monitoring

### Vercel Analytics (Free)

1. In Vercel project, go to **Analytics**
2. Enable Web Analytics
3. View page views, performance metrics

### Supabase Monitoring

1. In Supabase dashboard, go to **Database**
2. Check **Table Editor** for data
3. Monitor **API** usage in **Settings** → **API**

### Error Tracking

Check logs in:
- Vercel: **Deployments** → Click deployment → **Logs**
- Supabase: **Logs** section in dashboard

## Updating the App

### Automatic Deployments (Vercel)

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Vercel automatically deploys the new version
4. Check deployment status in Vercel dashboard

### Manual Deployments

If using self-hosted:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart sarathi
```

## Rollback

### Vercel

1. Go to **Deployments**
2. Find a previous working deployment
3. Click **⋯** → **Promote to Production**

### Self-Hosted

```bash
# Revert to previous commit
git log  # Find commit hash
git checkout <commit-hash>
npm install
npm run build
pm2 restart sarathi
```

## Troubleshooting Deployment

### Build Fails

**Error: "Module not found"**
- Run `npm install` locally
- Commit `package-lock.json`
- Push and redeploy

**Error: "Environment variable not found"**
- Check environment variables are set in Vercel/Netlify
- Variable names must match exactly
- Restart deployment after adding variables

### Runtime Errors

**"Failed to fetch" in production**
- Verify Supabase URL is correct
- Check Supabase project is not paused
- Verify anon key is correct

**Login doesn't work**
- Check Supabase Auth is enabled
- Verify user exists in Supabase dashboard
- Check browser console for errors

**Calendar not updating**
- Check API routes are deployed
- Verify Supabase RLS policies are correct
- Check network tab in browser dev tools

### Performance Issues

**Slow page loads**
- Enable Vercel Edge Network (automatic)
- Check Supabase region (should be close to users)
- Monitor Supabase database performance

**Database queries slow**
- Check indexes are created (in schema.sql)
- Monitor query performance in Supabase
- Consider upgrading Supabase plan if needed

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Using `NEXT_PUBLIC_` prefix only for public variables
- [ ] Supabase RLS policies are enabled
- [ ] Using `anon` key, not `service_role` key in frontend
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Strong passwords for Supabase users
- [ ] Regular backups of Supabase database

## Backup Strategy

### Supabase Backups

1. Go to Supabase dashboard → **Database** → **Backups**
2. Free tier: Daily backups, 7-day retention
3. Paid tier: Point-in-time recovery

### Manual Backup

```bash
# Export database (requires Supabase CLI)
supabase db dump -f backup.sql

# Or use pg_dump directly
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Restore from Backup

```bash
# Using Supabase CLI
supabase db reset

# Or using psql
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql
```

## Scaling Considerations

### When to Upgrade

**Supabase Free Tier Limits:**
- 500 MB database
- 2 GB bandwidth/month
- 50,000 monthly active users

**Vercel Free Tier Limits:**
- 100 GB bandwidth/month
- 100 deployments/day

### Upgrade Path

1. **More drivers (10-50)**
   - Free tier sufficient
   - No changes needed

2. **Multiple businesses (50-500 drivers)**
   - Add multi-tenancy
   - Upgrade Supabase to Pro ($25/month)
   - Consider Vercel Pro ($20/month)

3. **Large scale (500+ drivers)**
   - Implement caching
   - Optimize database queries
   - Consider dedicated database
   - Add CDN for static assets

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/support](https://supabase.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
