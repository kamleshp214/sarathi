# Sarathi Quick Reference Card

## Salary Calculation Formula

```
NET PAYABLE = Base Salary + Bhatta Earned - Total Advances

Where:
  Bhatta Earned = Days Present × Bhatta Rate (₹300)
```

## Attendance Status

| Status | Color | Bhatta? | When to Use |
|--------|-------|---------|-------------|
| **Present** | 🟢 Green | ✅ Yes | Driver worked |
| **Absent** | 🔴 Red | ❌ No | Driver didn't work |
| **Holiday** | ⚫ Grey | ❌ No | Sunday, festival |
| **Unmarked** | ⚪ White | ❌ No | Not yet marked |

## Quick Actions

### Add Driver
Dashboard → **+ Add New Driver** → Fill form → **Add Driver**

### Mark Attendance
Dashboard → **Attendance** → Tap date → Cycles through Present/Absent/Holiday

### Add Advance
Dashboard → **Add Advance** → Select driver → Enter amount → **Add Advance**

### View Settlement
Dashboard → **View Settlement** → Review → **Mark as Settled**

## Common Scenarios

### Scenario 1: Normal Month
- Base Salary: ₹10,000
- Days Present: 25
- Bhatta: 25 × ₹300 = ₹7,500
- Advances: ₹3,000
- **NET: ₹14,500** (green)

### Scenario 2: Many Advances
- Base Salary: ₹10,000
- Days Present: 15
- Bhatta: 15 × ₹300 = ₹4,500
- Advances: ₹18,000
- **NET: -₹3,500** (red, driver owes)

### Scenario 3: Many Absences
- Base Salary: ₹10,000
- Days Present: 5
- Bhatta: 5 × ₹300 = ₹1,500
- Advances: ₹2,000
- **NET: ₹9,500** (green)

## Important Rules

✅ **DO:**
- Mark attendance daily
- Record advances immediately
- Review settlement before marking as paid
- Keep phone numbers updated

❌ **DON'T:**
- Mark future dates
- Forget to record advances
- Settle without reviewing all advances
- Delete drivers (marks them inactive instead)

## Keyboard Shortcuts

- None (mobile-first app, use touch)

## Color Meanings

| Color | Meaning |
|-------|---------|
| 🟢 Green | Positive, Present, Success |
| 🔴 Red | Negative, Absent, Owes money |
| ⚫ Grey | Holiday, Neutral |
| 🟡 Amber | Advance, Warning |
| 🔵 Blue | Action, Link |

## Troubleshooting

### "Failed to fetch"
- Check internet connection
- Verify Supabase is running
- Check environment variables

### Login not working
- Verify email/password
- Check user exists in Supabase
- Try password reset

### Calendar not updating
- Refresh page
- Check console for errors
- Verify API routes working

### Wrong calculation
- Verify all attendance marked
- Check all advances recorded
- Review bhatta rate setting

## Support Contacts

- Documentation: See README.md
- Setup Help: See SETUP_GUIDE.md
- Business Logic: See BUSINESS_LOGIC.md
- Deployment: See DEPLOYMENT.md

## Version

**Sarathi v1.0**
- Last Updated: 2026
- Next.js 14
- Supabase
- Tailwind CSS

---

**Print this page and keep it handy!**
