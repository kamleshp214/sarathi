# Get Started with Sarathi

Welcome! This guide will get you up and running in 30 minutes.

## What You'll Need

- [ ] A computer with internet
- [ ] Node.js installed ([download here](https://nodejs.org))
- [ ] A Supabase account (free - [sign up here](https://supabase.com))
- [ ] 30 minutes of time

## Step-by-Step Setup

### Step 1: Supabase Setup (10 minutes)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project" and sign in
   - Click "New Project"
   - Name: `sarathi`
   - Create a strong database password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes

2. **Create Database Tables**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"
   - Open `supabase/schema.sql` from this project
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" (or Ctrl+Enter)
   - Should see "Success. No rows returned"

3. **Get Your API Keys**
   - Click "Project Settings" (gear icon)
   - Click "API"
   - Copy these two values:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: `eyJ...` (long string)
   - Keep this tab open

### Step 2: Configure App (5 minutes)

1. **Install Dependencies**
   ```bash
   cd sarathi
   npm install
   ```

2. **Set Environment Variables**
   - Open `.env.local` file
   - Replace with your Supabase values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
   ```
   - Save the file

### Step 3: Create User Account (2 minutes)

1. **In Supabase Dashboard**
   - Click "Authentication" in left sidebar
   - Click "Users" tab
   - Click "Add User" button
   - Select "Create new user"
   - Email: `admin@example.com` (or your email)
   - Password: Create a password (min 6 chars)
   - Click "Create user"
   - **Save these credentials!**

### Step 4: Run the App (1 minute)

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open in Browser**
   - Go to [http://localhost:3000](http://localhost:3000)
   - You'll see the login page

### Step 5: First Login (1 minute)

1. Enter the email and password you created
2. Click "Sign In"
3. You should see the dashboard (empty)

### Step 6: Add First Driver (2 minutes)

1. Click "**+ Add New Driver**"
2. Fill in:
   - Name: `Rajesh Kumar`
   - Phone: `9876543210`
   - Base Salary: `10000`
   - Bhatta Rate: `300` (pre-filled)
   - Joining Date: Today
3. Click "**Add Driver**"
4. You'll see the driver card

### Step 7: Mark Attendance (2 minutes)

1. Click "**Attendance**" on the driver card
2. Tap today's date → turns green (Present)
3. Tap yesterday → turns green
4. Tap a few more days
5. Click "← Back to Dashboard"
6. See the days count updated

### Step 8: Add Advance (2 minutes)

1. Click "**Add Advance**" on driver card
2. Amount: `2000`
3. Note: `Fuel advance`
4. Date: Today
5. Click "**Add Advance**"
6. See advance amount on dashboard

### Step 9: View Settlement (2 minutes)

1. Click "**View Settlement**"
2. See the breakdown:
   - Days Present
   - Base Salary + Bhatta
   - Advances
   - **NET PAYABLE**
3. Click "**Mark as Settled**"
4. See "✓ Settled" confirmation

## You're Done! 🎉

You now have a working driver management system.

## What's Next?

### Add More Drivers
- Add your actual drivers
- Use real phone numbers
- Set correct base salaries

### Daily Usage
- Mark attendance every day
- Record advances immediately
- Review settlements monthly

### Deploy to Production
- See `DEPLOYMENT.md` for Vercel deployment
- Get a live URL to access from phone
- Share with your team

## Need Help?

### Documentation
- **README.md** - Overview and features
- **SETUP_GUIDE.md** - Detailed setup instructions
- **BUSINESS_LOGIC.md** - How salary calculation works
- **DEPLOYMENT.md** - How to deploy to production
- **TESTING_CHECKLIST.md** - Verify everything works
- **QUICK_REFERENCE.md** - Quick tips and formulas

### Common Issues

**"Invalid API key"**
- Check `.env.local` has correct values
- No extra spaces
- Restart dev server

**"Failed to fetch"**
- Check internet connection
- Verify Supabase project is active
- Check Project URL is correct

**Login fails**
- Verify user exists in Supabase
- Check email/password spelling
- Try creating new user

### Still Stuck?

1. Check browser console (F12) for errors
2. Check terminal for error messages
3. Review SETUP_GUIDE.md for detailed steps
4. Verify all steps completed

## Tips for Success

✅ **Mark attendance daily** - Don't wait until month-end

✅ **Record advances immediately** - Easy to forget later

✅ **Review before settling** - Double-check calculations

✅ **Keep phone numbers updated** - For future WhatsApp features

✅ **Backup regularly** - Supabase does this automatically

## Mobile Access

Once deployed to Vercel:
1. Open on your phone's browser
2. Add to home screen for app-like experience
3. Use daily for attendance marking

## Questions?

Refer to the documentation files in this project:
- All questions about setup → SETUP_GUIDE.md
- All questions about calculations → BUSINESS_LOGIC.md
- All questions about deployment → DEPLOYMENT.md

---

**Happy tracking! 🚛**
