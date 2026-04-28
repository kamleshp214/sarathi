# Testing Checklist

Use this checklist to verify that Sarathi is working correctly before going live.

## Pre-Deployment Testing

### Database Setup
- [ ] Supabase project created
- [ ] schema.sql executed successfully
- [ ] All 4 tables created (drivers, attendance, advances, settlements)
- [ ] RLS policies enabled on all tables
- [ ] Indexes created successfully

### Environment Configuration
- [ ] .env.local file created
- [ ] NEXT_PUBLIC_SUPABASE_URL set correctly
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY set correctly
- [ ] No extra spaces in environment variables
- [ ] .env.local is in .gitignore

### Authentication
- [ ] At least one user created in Supabase
- [ ] User credentials saved securely
- [ ] Can access Supabase dashboard
- [ ] Auth policies working

## Functional Testing

### Login Flow
- [ ] Navigate to app URL
- [ ] Redirected to /login automatically
- [ ] Login form displays correctly
- [ ] Can enter email and password
- [ ] "Sign In" button works
- [ ] Successful login redirects to /dashboard
- [ ] Invalid credentials show error message
- [ ] Error message is clear and helpful

### Dashboard
- [ ] Dashboard loads without errors
- [ ] "Sarathi" title displays
- [ ] "Add New Driver" button visible
- [ ] Empty state shows when no drivers
- [ ] Empty state message is clear

### Add Driver
- [ ] Click "Add New Driver" button
- [ ] Form loads correctly
- [ ] All fields present: name, phone, base_salary, bhatta_rate, joining_date
- [ ] Bhatta rate pre-filled with 300
- [ ] Joining date defaults to today
- [ ] Can enter driver name
- [ ] Can enter phone number
- [ ] Can enter base salary
- [ ] Can change bhatta rate
- [ ] Can select joining date
- [ ] "Add Driver" button works
- [ ] Redirects to dashboard after save
- [ ] New driver appears on dashboard
- [ ] Driver card shows correct information

### Driver Card (Dashboard)
- [ ] Driver name displays correctly
- [ ] Phone number displays correctly
- [ ] "This Month" section shows
- [ ] Days present shows 0 initially
- [ ] Advances shows ₹0 initially
- [ ] "Attendance" button visible and clickable
- [ ] "Add Advance" button visible and clickable
- [ ] "View Settlement" button visible and clickable

### Attendance Calendar
- [ ] Click "Attendance" on driver card
- [ ] Calendar page loads
- [ ] Driver name and phone display at top
- [ ] Current month and year display
- [ ] Calendar shows correct number of days
- [ ] Days of week (Sun-Sat) display correctly
- [ ] Legend shows (P/A/H with colors)
- [ ] All dates are unmarked (white) initially
- [ ] Can tap a date
- [ ] First tap marks as Present (green dot)
- [ ] Second tap marks as Absent (red dot)
- [ ] Third tap marks as Holiday (grey dot)
- [ ] Fourth tap returns to unmarked (white)
- [ ] Future dates are disabled
- [ ] Future dates show as greyed out
- [ ] Cannot tap future dates
- [ ] Calendar updates immediately after tap
- [ ] No page refresh needed
- [ ] "Back to Dashboard" link works

### Attendance Persistence
- [ ] Mark a date as Present
- [ ] Navigate back to dashboard
- [ ] Return to attendance calendar
- [ ] Previously marked date still shows Present
- [ ] Mark multiple dates
- [ ] All marked dates persist correctly

### Dashboard Stats Update
- [ ] Mark 3 days as Present in calendar
- [ ] Return to dashboard
- [ ] Driver card shows "3 days" in This Month
- [ ] Stats update automatically

### Add Advance
- [ ] Click "Add Advance" on driver card
- [ ] Form loads correctly
- [ ] Driver is pre-selected in dropdown
- [ ] Can select different driver
- [ ] Amount field is empty
- [ ] Note field is empty
- [ ] Date defaults to today
- [ ] Can enter amount (numbers only)
- [ ] Can enter note (optional)
- [ ] Can change date
- [ ] "Add Advance" button works
- [ ] Redirects to dashboard after save
- [ ] Dashboard shows updated advance amount

### Advance from Driver Page
- [ ] Open driver attendance page
- [ ] Scroll down to "Advances This Month"
- [ ] Click "+ Add" button
- [ ] Advance form opens with driver pre-selected
- [ ] Add advance
- [ ] Return to driver page
- [ ] New advance appears in list
- [ ] Advance shows date, note, and amount
- [ ] Amount formatted with ₹ symbol

### Net Payable Calculation
- [ ] Open driver attendance page
- [ ] Mark 5 days as Present
- [ ] Add advance of ₹2,000
- [ ] Scroll to bottom bar
- [ ] "Net Payable" displays
- [ ] Amount is calculated correctly:
  - Base Salary + (5 × 300) - 2000
- [ ] Amount shows in green if positive
- [ ] Amount formatted with ₹ symbol

### Settlement Page
- [ ] Click "View Settlement" from driver page
- [ ] Settlement page loads
- [ ] Driver name displays
- [ ] Month and year display
- [ ] Attendance section shows:
  - Days Present (correct count)
  - Days Absent (correct count)
  - Holidays (correct count)
- [ ] Earnings section shows:
  - Base Salary (correct amount)
  - Bhatta calculation (days × rate)
  - Total Earned (sum)
- [ ] Advances section shows:
  - List of all advances
  - Each advance has date, note, amount
  - Total Advances (sum)
- [ ] NET PAYABLE displays prominently
- [ ] NET PAYABLE is correct
- [ ] NET PAYABLE is green if positive
- [ ] "Mark as Settled" button visible

### Mark as Settled
- [ ] Click "Mark as Settled"
- [ ] Page updates
- [ ] Button changes to "✓ Settled"
- [ ] Shows "Paid on [date]"
- [ ] Date is today's date
- [ ] Cannot mark as settled again

### Negative Balance
- [ ] Create new driver with base salary ₹10,000
- [ ] Mark 2 days as Present (₹600 bhatta)
- [ ] Add advance of ₹15,000
- [ ] View settlement
- [ ] NET PAYABLE shows -₹4,400
- [ ] Amount is RED
- [ ] Shows "Driver owes this amount"

### Multiple Drivers
- [ ] Add 3 different drivers
- [ ] All appear on dashboard
- [ ] Each has independent attendance
- [ ] Each has independent advances
- [ ] Each has independent settlement
- [ ] No data mixing between drivers

## Mobile Testing

### Responsive Design
- [ ] Open on mobile device (or Chrome DevTools mobile view)
- [ ] All pages fit screen width
- [ ] No horizontal scrolling
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (not too small)
- [ ] Forms are usable
- [ ] Calendar is usable

### Touch Interactions
- [ ] Can tap all buttons
- [ ] Buttons have visual feedback (active state)
- [ ] Calendar dates are easy to tap
- [ ] No accidental taps
- [ ] Scrolling works smoothly
- [ ] Forms don't zoom on input focus (if possible)

### Mobile Browsers
- [ ] Test on Chrome Android
- [ ] Test on Safari iOS (if available)
- [ ] Test on Firefox Mobile (if available)

## Edge Cases

### Empty States
- [ ] Dashboard with no drivers shows message
- [ ] Driver with no attendance shows empty calendar
- [ ] Driver with no advances shows message
- [ ] All empty states are clear

### Boundary Values
- [ ] Can add driver with base salary ₹0
- [ ] Can add driver with base salary ₹999,999
- [ ] Can add advance of ₹1
- [ ] Can add advance of ₹99,999
- [ ] Can mark all days in month as Present
- [ ] Can mark all days in month as Absent

### Date Handling
- [ ] Calendar shows correct days for current month
- [ ] Calendar handles month with 28 days (February)
- [ ] Calendar handles month with 31 days
- [ ] First day of month aligns correctly
- [ ] Cannot mark dates in future
- [ ] Can mark dates in past

### Data Validation
- [ ] Cannot submit driver form with empty name
- [ ] Cannot submit driver form with empty phone
- [ ] Cannot submit driver form with empty base salary
- [ ] Cannot submit advance form with empty amount
- [ ] Cannot submit advance form without selecting driver

### Concurrent Updates
- [ ] Mark attendance on one device
- [ ] Refresh on another device
- [ ] Changes appear (may need manual refresh)

## Performance Testing

### Load Times
- [ ] Dashboard loads in < 3 seconds
- [ ] Driver page loads in < 3 seconds
- [ ] Calendar updates in < 1 second
- [ ] Form submissions complete in < 2 seconds

### Network Conditions
- [ ] Test on slow 3G (Chrome DevTools)
- [ ] App still usable
- [ ] Loading states show (if implemented)
- [ ] No timeout errors

## Security Testing

### Authentication
- [ ] Cannot access /dashboard without login
- [ ] Cannot access /drivers/[id] without login
- [ ] Logout works (if implemented)
- [ ] Session persists on page refresh

### Data Access
- [ ] Can only see own drivers
- [ ] Cannot access other users' data
- [ ] RLS policies enforced

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Android
- [ ] Safari iOS
- [ ] Samsung Internet (if available)

## Post-Deployment Testing

### Production Environment
- [ ] App accessible at production URL
- [ ] HTTPS enabled (lock icon in browser)
- [ ] Login works in production
- [ ] All features work same as local
- [ ] No console errors
- [ ] No 404 errors

### Supabase Connection
- [ ] App connects to Supabase
- [ ] Data saves correctly
- [ ] Data retrieves correctly
- [ ] No connection errors

### Environment Variables
- [ ] All environment variables set in Vercel
- [ ] Variables are correct
- [ ] No placeholder values

## User Acceptance Testing

### Real User Test
- [ ] Give app to actual business owner
- [ ] Observe them using it
- [ ] Can they add a driver without help?
- [ ] Can they mark attendance without help?
- [ ] Can they understand the settlement?
- [ ] Do they find it useful?
- [ ] Collect feedback

### Common Tasks
- [ ] Add 5 drivers in < 10 minutes
- [ ] Mark attendance for all drivers in < 5 minutes
- [ ] Add 3 advances in < 3 minutes
- [ ] Generate settlement in < 2 minutes

## Bug Tracking

If you find issues, document:
- [ ] What you were doing
- [ ] What you expected to happen
- [ ] What actually happened
- [ ] Browser and device
- [ ] Screenshots if possible
- [ ] Console errors if any

## Sign-Off

- [ ] All critical features working
- [ ] No blocking bugs
- [ ] Mobile experience acceptable
- [ ] Performance acceptable
- [ ] Ready for production use

---

**Testing completed by:** _______________

**Date:** _______________

**Notes:**
