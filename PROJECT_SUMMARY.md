# Sarathi - Project Summary

## Overview

Sarathi is a mobile-first web application designed for small construction and logistics businesses in India to manage driver attendance, cash advances, and monthly salary settlements. It replaces manual Excel-based tracking with an automated, easy-to-use digital solution.

## Target Users

- Small business owners (construction material suppliers, logistics companies)
- 5-10 truck drivers per business
- Non-technical users on Android phones
- Hindi/English speaking users in India

## Problem Solved

**Before Sarathi:**
- Manual Excel tracking of attendance
- Paper-based advance records
- Error-prone month-end calculations
- Time-consuming settlement process
- No historical records

**After Sarathi:**
- Digital attendance calendar
- Automatic salary calculations
- Instant settlement reports
- Historical tracking
- Mobile-accessible anywhere

## Key Features

### 1. Driver Management
- Add driver profiles with base salary and bhatta rate
- Store contact information
- Track joining date
- Active/inactive status

### 2. Attendance Tracking
- Interactive monthly calendar
- Tap to mark: Present/Absent/Holiday
- Visual color coding (green/red/grey)
- Cannot mark future dates
- Real-time updates

### 3. Advance Management
- Record cash advances with date and note
- View advance history per driver
- Automatic deduction from salary
- Month-wise tracking

### 4. Salary Settlement
- Automated calculation based on formula
- Detailed breakdown of earnings and advances
- Visual indication of positive/negative balance
- Mark as settled with timestamp
- Historical settlement records

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Pattern**: Server Components + Client Components
- **Mobile-First**: Responsive design optimized for phones

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **Real-time**: Client-side state management

### Deployment
- **Hosting**: Vercel (recommended)
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **SSL**: Automatic HTTPS

## Database Schema

### Tables
1. **drivers**: Driver profiles and salary configuration
2. **attendance**: Daily attendance records (unique per driver per date)
3. **advances**: Cash advance records
4. **settlements**: Monthly settlement snapshots

### Security
- Row Level Security (RLS) enabled on all tables
- Only authenticated users can access data
- No public access to any data

## Business Logic

### Salary Formula
```
Base Salary + (Days Present × Bhatta Rate) - Total Advances = Net Payable
```

### Key Rules
- Bhatta only paid on Present days
- Absent and Holiday days earn NO bhatta
- Base salary always paid regardless of attendance
- Net payable can be negative (driver owes money)
- Unmarked days treated as Absent

## File Structure

```
sarathi/
├── app/
│   ├── dashboard/          # Main dashboard
│   ├── drivers/
│   │   ├── new/           # Add driver form
│   │   └── [id]/          # Driver detail with calendar
│   ├── advances/
│   │   └── new/           # Add advance form
│   ├── settlement/
│   │   └── [driverId]/[year]/[month]/  # Settlement page
│   ├── login/             # Login page
│   ├── api/
│   │   └── attendance/    # Attendance API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home (redirects to dashboard)
│   └── globals.css        # Global styles
├── components/
│   └── AttendanceCalendar.tsx  # Interactive calendar component
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   ├── server.ts      # Server Supabase client
│   │   └── middleware.ts  # Auth middleware
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── supabase/
│   └── schema.sql         # Database schema
├── middleware.ts          # Next.js middleware for auth
├── .env.local            # Environment variables (not committed)
├── package.json          # Dependencies
└── Documentation files
```

## User Flows

### 1. First Time Setup
1. Create Supabase project
2. Run schema.sql
3. Configure environment variables
4. Create first user in Supabase
5. Deploy or run locally
6. Login with credentials

### 2. Daily Usage
1. Login to dashboard
2. See all drivers with current month stats
3. Tap "Attendance" on driver card
4. Mark today's attendance
5. Add advance if needed
6. Repeat for all drivers

### 3. Month-End Settlement
1. Open driver detail page
2. Review attendance for the month
3. Verify all advances recorded
4. Tap "View Settlement"
5. Review calculation
6. Tap "Mark as Settled"
7. Pay driver the net amount

## Design Principles

### Mobile-First
- Large touch targets (48px minimum)
- Large text (18px+)
- Simple navigation
- No complex gestures
- Works on slow networks

### Simplicity
- No unnecessary features
- Clear visual hierarchy
- Obvious actions
- Minimal text
- Instant feedback

### Reliability
- Offline-first approach (future)
- Automatic saves
- No data loss
- Clear error messages
- Consistent behavior

### Localization
- Rupee symbol (₹) everywhere
- Indian date formats
- Indian phone number format
- English language (Hindi future)

## Color System

| Color | Hex | Usage |
|-------|-----|-------|
| Green | #22c55e | Present, Positive balance, Success |
| Red | #ef4444 | Absent, Negative balance, Errors |
| Grey | #9ca3af | Holiday, Disabled, Neutral |
| Amber | #f59e0b | Advances, Warnings |
| Blue | #2563eb | Actions, Links |

## Performance Targets

- **First Load**: < 2 seconds on 3G
- **Interaction**: < 100ms response time
- **Calendar Update**: < 500ms
- **Page Navigation**: < 1 second

## Browser Support

- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements (Not in v1)

### Phase 2
- WhatsApp sharing of settlements
- PDF export
- Hindi language support
- Offline mode
- Push notifications

### Phase 3
- Multi-business support (tenancy)
- Trip tracking
- Route management
- Fuel tracking
- Vehicle maintenance

### Phase 4
- Mobile apps (iOS/Android)
- Advanced reporting
- Data export
- Integration with accounting software

## Limitations (v1)

- Single business owner only
- No multi-user access
- No role-based permissions
- No data export
- No PDF generation
- English only
- No offline support
- No WhatsApp integration

## Success Metrics

### User Adoption
- Time to add first driver: < 2 minutes
- Time to mark attendance: < 30 seconds
- Time to generate settlement: < 1 minute

### Business Impact
- Reduce settlement calculation time: 80%
- Eliminate calculation errors: 100%
- Improve record keeping: Historical data available

### Technical
- 99.9% uptime (Vercel/Supabase SLA)
- < 2 second page loads
- Zero data loss

## Support & Maintenance

### Documentation
- README.md: Quick overview
- SETUP_GUIDE.md: Step-by-step setup
- BUSINESS_LOGIC.md: Salary calculation rules
- DEPLOYMENT.md: Deployment instructions
- PROJECT_SUMMARY.md: This file

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Comments for complex logic

### Testing Strategy
- Manual testing for v1
- Test all user flows before deployment
- Test on real mobile devices
- Test with real data

## Cost Estimate

### Free Tier (0-10 drivers)
- Supabase: Free
- Vercel: Free
- Total: ₹0/month

### Small Business (10-50 drivers)
- Supabase Pro: $25/month (₹2,000)
- Vercel: Free
- Total: ₹2,000/month

### Medium Business (50-200 drivers)
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Total: ₹3,500/month

## Getting Started

1. Read SETUP_GUIDE.md for detailed setup instructions
2. Follow steps to create Supabase project
3. Configure environment variables
4. Run locally with `npm run dev`
5. Test all features
6. Deploy to Vercel
7. Share with users

## Contributing

This is a business-specific application. For modifications:
1. Understand BUSINESS_LOGIC.md thoroughly
2. Test salary calculations extensively
3. Verify on mobile devices
4. Maintain mobile-first design
5. Keep it simple

## License

MIT License - Free to use and modify

## Contact

For questions or support, refer to the documentation files or create an issue on GitHub.

---

**Built with ❤️ for small business owners in India**
