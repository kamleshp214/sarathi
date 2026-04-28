# Sarathi - Driver Attendance & Salary Management

A mobile-first web application for managing driver attendance, advances, and salary settlements for small construction/logistics businesses in India.

## Features

- **Driver Management**: Add and manage driver profiles with base salary and bhatta rates
- **Attendance Tracking**: Interactive calendar to mark daily attendance (Present/Absent/Holiday)
- **Advance Management**: Record cash advances given to drivers
- **Salary Settlement**: Automated calculation of monthly net payable based on attendance and advances
- **Mobile-First Design**: Optimized for Android phones with large touch targets

## Salary Calculation Formula

```
Base Salary         = Fixed monthly amount per driver
Bhatta Earned       = ₹300 × Days Present ONLY
Total Earned        = Base Salary + Bhatta Earned
Total Advances      = Sum of all cash advances
NET PAYABLE         = Total Earned - Total Advances
```

**Important**: Bhatta is only paid on days marked as "Present". Absent days and holidays do NOT earn bhatta.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the contents of `supabase/schema.sql`
5. Run the SQL to create tables and policies

### 2. Get Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

1. Rename `.env.local` or update it with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create First User

1. Go to your Supabase dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** > **Create new user**
4. Enter email and password
5. Use these credentials to log in to the app

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

## Usage Guide

### Adding a Driver

1. From dashboard, tap **+ Add New Driver**
2. Fill in name, phone, base salary, bhatta rate, and joining date
3. Tap **Add Driver**

### Marking Attendance

1. From dashboard, tap **Attendance** on a driver card
2. Tap any date in the calendar to cycle through:
   - Unmarked (white) → Present (green) → Absent (red) → Holiday (grey) → Unmarked
3. Future dates cannot be marked

### Adding an Advance

1. From dashboard, tap **Add Advance** on a driver card
2. Enter amount, optional note, and date
3. Tap **Add Advance**

### Viewing Settlement

1. From dashboard, tap **View Settlement** on a driver card
2. Review attendance summary, earnings breakdown, and advances
3. Tap **Mark as Settled** to record payment

## Database Schema

### drivers
- id, name, phone, base_salary, bhatta_rate, joining_date, is_active

### attendance
- id, driver_id, date, status (present/absent/holiday)
- Unique constraint on (driver_id, date)

### advances
- id, driver_id, date, amount, note

### settlements
- id, driver_id, month, year, net_payable, is_paid, paid_at

## Color System

- **Green (#22c55e)**: Present / Positive balance
- **Red (#ef4444)**: Absent / Driver owes money
- **Grey (#9ca3af)**: Holiday
- **Amber (#f59e0b)**: Advance given
- **White**: Unmarked attendance

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT
