# Sarathi Setup Guide

Complete step-by-step guide to get Sarathi running.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A code editor (VS Code recommended)

## Step 1: Supabase Setup (15 minutes)

### Create Project

1. Visit [supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign in with GitHub
4. Click **New Project**
5. Fill in:
   - **Name**: sarathi
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to India (e.g., Mumbai)
6. Click **Create new project**
7. Wait 2-3 minutes for provisioning

### Create Database Tables

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase/schema.sql` from this project
4. Copy ALL the SQL code
5. Paste it into the Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

### Get API Credentials

1. Click **Project Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
4. Keep this tab open - you'll need these values next

## Step 2: Local Setup (5 minutes)

### Install Dependencies

Open terminal in the `sarathi` folder and run:

```bash
npm install
```

### Configure Environment Variables

1. Open the file `.env.local` in your code editor
2. Replace the placeholder values with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-long-key-here
```

3. Save the file

## Step 3: Create First User (2 minutes)

You need at least one user account to log in.

### Option A: Via Supabase Dashboard (Recommended)

1. In Supabase dashboard, click **Authentication** (left sidebar)
2. Click **Users** tab
3. Click **Add User** button (top right)
4. Select **Create new user**
5. Enter:
   - **Email**: your email (e.g., `admin@example.com`)
   - **Password**: create a password (min 6 characters)
6. Click **Create user**
7. **Important**: Save these credentials - you'll use them to log in!

### Option B: Via Email Signup (Requires Email Setup)

If you've configured email in Supabase:
1. Run the app (see next step)
2. You can add a signup page later

## Step 4: Run the App (1 minute)

In terminal, run:

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: First Login

1. You'll be redirected to `/login`
2. Enter the email and password you created in Step 3
3. Click **Sign In**
4. You should see the dashboard (empty at first)

## Step 6: Add Your First Driver

1. Click **+ Add New Driver**
2. Fill in:
   - **Driver Name**: e.g., "Rajesh Kumar"
   - **Phone Number**: e.g., "9876543210"
   - **Base Salary**: e.g., "10000"
   - **Bhatta Rate**: 300 (pre-filled)
   - **Joining Date**: Select today or any past date
3. Click **Add Driver**
4. You'll see the driver card on the dashboard

## Step 7: Test Attendance

1. Click **Attendance** on the driver card
2. You'll see a calendar for the current month
3. Tap any date to mark attendance:
   - First tap: Present (green dot)
   - Second tap: Absent (red dot)
   - Third tap: Holiday (grey dot)
   - Fourth tap: Unmarked (white)
4. Mark a few days as Present

## Step 8: Add an Advance

1. Go back to dashboard (click "← Back to Dashboard")
2. Click **Add Advance** on the driver card
3. Fill in:
   - **Amount**: e.g., "2000"
   - **Note**: e.g., "Fuel advance"
   - **Date**: Today (pre-filled)
4. Click **Add Advance**

## Step 9: View Settlement

1. From dashboard, click **View Settlement**
2. You'll see:
   - Days present/absent/holidays
   - Base salary + Bhatta calculation
   - List of advances
   - **NET PAYABLE** (in green if positive, red if negative)
3. Click **Mark as Settled** to record payment

## Troubleshooting

### "Invalid API key" error

- Check that you copied the **anon public** key, not the service_role key
- Make sure there are no extra spaces in `.env.local`
- Restart the dev server after changing `.env.local`

### "Failed to fetch" or connection errors

- Verify your Supabase project URL is correct
- Check that your Supabase project is active (not paused)
- Ensure you have internet connection

### Login fails with "Invalid credentials"

- Double-check the email/password you created in Supabase
- Go to Supabase dashboard > Authentication > Users to verify the user exists
- Try creating a new user

### SQL errors when running schema

- Make sure you copied the ENTIRE schema.sql file
- Run it in a fresh SQL Editor tab
- Check that your Supabase project is fully provisioned

### Calendar not updating

- Check browser console for errors (F12)
- Verify the attendance API route is working
- Try refreshing the page

## Next Steps

### Deploy to Vercel (Optional)

1. Push your code to GitHub (create a new repository)
2. Go to [vercel.com](https://vercel.com)
3. Click **Import Project**
4. Select your GitHub repository
5. Add environment variables (same as `.env.local`)
6. Click **Deploy**
7. Your app will be live at `https://your-app.vercel.app`

### Customize

- Adjust bhatta rates per driver
- Modify colors in the code
- Add more drivers
- Track multiple months

## Support

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Check the terminal where `npm run dev` is running
3. Verify all environment variables are set correctly
4. Ensure Supabase tables were created successfully

## Security Notes

- Never commit `.env.local` to Git (it's in `.gitignore`)
- The anon key is safe to use in frontend code
- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can access data
