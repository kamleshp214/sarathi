# Sarathi Business Logic Reference

## Core Salary Calculation

This is the most critical part of the system. **Do not modify this logic without understanding the business requirements.**

### Formula

```
Base Salary         = Fixed monthly amount (e.g., ₹10,000)
Bhatta Earned       = ₹300 × Days Present ONLY
Total Earned        = Base Salary + Bhatta Earned
Total Advances      = Sum of all cash advances given
NET PAYABLE         = Total Earned - Total Advances
```

### Key Rules

1. **Bhatta is ONLY paid on Present days**
   - Present day = Bhatta earned
   - Absent day = NO bhatta
   - Holiday = NO bhatta
   - Unmarked day = Treated as Absent = NO bhatta

2. **Base Salary is always paid**
   - Regardless of attendance
   - Fixed amount per month
   - Set when driver is added

3. **Holidays are UNPAID**
   - Marking a day as Holiday means no bhatta
   - Used for Sundays, festivals, etc.
   - Driver still gets base salary

4. **Net Payable can be negative**
   - If advances exceed earnings
   - Shown in RED
   - Means driver owes the owner money

### Example Calculation

**Driver Details:**
- Base Salary: ₹10,000
- Bhatta Rate: ₹300/day

**Month Attendance:**
- Present: 22 days
- Absent: 5 days
- Holiday: 3 days
- Total days in month: 30

**Advances Given:**
- ₹2,000 on 5th
- ₹1,500 on 15th
- ₹1,000 on 25th
- Total: ₹4,500

**Calculation:**
```
Base Salary     = ₹10,000
Bhatta Earned   = 22 days × ₹300 = ₹6,600
Total Earned    = ₹10,000 + ₹6,600 = ₹16,600
Total Advances  = ₹4,500
NET PAYABLE     = ₹16,600 - ₹4,500 = ₹12,100
```

Owner pays driver ₹12,100 at month-end.

### Edge Cases

#### Case 1: Driver owes money
```
Base Salary     = ₹10,000
Bhatta Earned   = 10 days × ₹300 = ₹3,000
Total Earned    = ₹13,000
Total Advances  = ₹15,000
NET PAYABLE     = ₹13,000 - ₹15,000 = -₹2,000
```
Driver owes ₹2,000 to owner (shown in RED).

#### Case 2: No advances
```
Base Salary     = ₹10,000
Bhatta Earned   = 25 days × ₹300 = ₹7,500
Total Earned    = ₹17,500
Total Advances  = ₹0
NET PAYABLE     = ₹17,500
```
Owner pays full ₹17,500.

#### Case 3: All days absent
```
Base Salary     = ₹10,000
Bhatta Earned   = 0 days × ₹300 = ₹0
Total Earned    = ₹10,000
Total Advances  = ₹3,000
NET PAYABLE     = ₹7,000
```
Driver still gets base salary minus advances.

## Attendance Status Definitions

### Present (Green)
- Driver worked that day
- Earns bhatta for this day
- Counts toward monthly earnings

### Absent (Red)
- Driver did not work
- NO bhatta earned
- Does not count toward earnings
- Still gets base salary

### Holiday (Grey)
- Designated off day (Sunday, festival, etc.)
- NO bhatta earned
- Used to distinguish from absent
- Still gets base salary

### Unmarked (White)
- No status recorded
- **Treated as Absent by default**
- NO bhatta earned
- Should be marked before settlement

## Settlement Process

### When to Settle
- At the end of each month
- After all attendance is marked
- After all advances are recorded

### Settlement Steps
1. Review attendance summary
2. Verify all advances are recorded
3. Check NET PAYABLE amount
4. If positive (green): Owner pays driver
5. If negative (red): Driver owes owner
6. Click "Mark as Settled"
7. Record is saved with timestamp

### After Settlement
- Settlement is marked as paid
- Shows paid date
- Cannot be unmarked (permanent record)
- Can view historical settlements

## Advance Management

### When to Record Advances
- Immediately when cash is given
- Can be recorded retroactively
- Should include date and optional note

### Advance Rules
- Any positive amount
- Date must be specified
- Note is optional but recommended
- Deducted from monthly earnings
- Can exceed monthly earnings (driver owes money)

### Common Advance Reasons
- Fuel
- Emergency
- Festival advance
- Medical
- Personal loan

## Month Boundaries

### Current Month
- Dashboard shows current month stats
- Calendar defaults to current month
- Advances default to today's date

### Past Months
- Can view past settlements
- Cannot modify past settlements once marked as paid
- Can still add/edit attendance for past months

### Future Dates
- Cannot mark attendance for future dates
- Shown as disabled in calendar
- Can record advances for future dates (not recommended)

## Data Integrity

### Unique Constraints
- One attendance record per driver per date
- Updating attendance overwrites previous status

### Deletion Rules
- Deleting a driver deletes all related records (attendance, advances, settlements)
- Cannot delete individual attendance (set to unmarked instead)
- Cannot delete advances (would affect settlement accuracy)

### Audit Trail
- All records have created_at timestamp
- Settlements record paid_at timestamp
- Cannot modify historical settlements

## UI Color Coding

| Color | Meaning | Usage |
|-------|---------|-------|
| Green (#22c55e) | Present / Positive | Attendance, positive balance |
| Red (#ef4444) | Absent / Negative | Attendance, driver owes money |
| Grey (#9ca3af) | Holiday | Attendance |
| Amber (#f59e0b) | Advance | Advance amounts |
| White | Unmarked | Default attendance state |

## Mobile Optimization

### Touch Targets
- Minimum 48px height for all buttons
- Large text throughout (18px+)
- Adequate spacing between interactive elements

### Calendar Interaction
- Tap to cycle through statuses
- Visual feedback on tap
- Disabled state for future dates

### Form Inputs
- Large input fields (text-lg)
- Number keyboards for amounts
- Date pickers for dates
- Dropdowns for driver selection

## Business Assumptions

1. **Single Business Owner**
   - One user account per business
   - No multi-tenant support
   - All drivers belong to one owner

2. **Monthly Settlement Cycle**
   - Settlements are per month
   - No weekly or bi-weekly support
   - Month boundaries are calendar months

3. **Cash-Based**
   - All advances are cash
   - No bank transfer tracking
   - No receipt generation

4. **Indian Context**
   - Currency in Rupees (₹)
   - Date format: DD/MM/YYYY
   - Phone numbers: 10 digits

5. **Small Scale**
   - 5-10 drivers typical
   - No complex reporting
   - No export features (v1)
