# Sarathi Application Flow

Visual guide to understand how the app works.

## User Journey Map

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Login Page     │ ← Enter email/password
│  /login         │
└────────┬────────┘
         │ ✓ Authenticated
         ▼
┌─────────────────────────────────────────┐
│         Dashboard                       │
│         /dashboard                      │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  Driver Card: Rajesh Kumar      │  │
│  │  Phone: 9876543210              │  │
│  │  This Month: 15 days            │  │
│  │  Advances: ₹3,000               │  │
│  │                                 │  │
│  │  [Attendance] [Add Advance]    │  │
│  │  [View Settlement]              │  │
│  └─────────────────────────────────┘  │
│                                         │
│  [+ Add New Driver]                    │
└───┬─────────────┬───────────────┬──────┘
    │             │               │
    │             │               │
    ▼             ▼               ▼
┌────────┐  ┌──────────┐  ┌────────────┐
│Add     │  │Add       │  │View        │
│Driver  │  │Advance   │  │Settlement  │
└────────┘  └──────────┘  └────────────┘
```

## Detailed Screen Flows

### 1. Add Driver Flow

```
Dashboard
    │
    ▼ Click "+ Add New Driver"
┌─────────────────────┐
│  Add Driver Form    │
│  /drivers/new       │
│                     │
│  Name: [_______]    │
│  Phone: [_______]   │
│  Base Salary: [___] │
│  Bhatta Rate: [300] │
│  Joining Date: [__] │
│                     │
│  [Add Driver]       │
└──────────┬──────────┘
           │ Submit
           ▼
      Dashboard
   (new driver appears)
```

### 2. Attendance Marking Flow

```
Dashboard
    │
    ▼ Click "Attendance"
┌─────────────────────────────────┐
│  Driver Detail Page             │
│  /drivers/[id]                  │
│                                 │
│  ┌───────────────────────────┐ │
│  │  Calendar - January 2026  │ │
│  │                           │ │
│  │  Sun Mon Tue Wed Thu Fri  │ │
│  │   1   2   3   4   5   6   │ │
│  │  ⚪  🟢  🟢  🔴  🟢  🟢  │ │
│  │   7   8   9  10  11  12   │ │
│  │  ⚫  🟢  🟢  🟢  🟢  🟢  │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  Tap date → Cycles:             │
│  ⚪ → 🟢 → 🔴 → ⚫ → ⚪        │
│                                 │
│  Advances This Month:           │
│  ┌─────────────────────────┐   │
│  │ 05 Jan  Fuel  ₹2,000    │   │
│  │ 15 Jan  Emergency ₹1,500│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Net Payable: ₹12,100    │   │
│  │ [View Full Settlement]  │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### 3. Add Advance Flow

```
Dashboard or Driver Page
    │
    ▼ Click "Add Advance"
┌─────────────────────┐
│  Add Advance Form   │
│  /advances/new      │
│                     │
│  Driver: [Select▼]  │
│  Amount: [_______]  │
│  Note: [_________]  │
│  Date: [Today]      │
│                     │
│  [Add Advance]      │
└──────────┬──────────┘
           │ Submit
           ▼
      Dashboard
   (advance added)
```

### 4. Settlement Flow

```
Driver Page or Dashboard
    │
    ▼ Click "View Settlement"
┌─────────────────────────────────┐
│  Settlement Page                │
│  /settlement/[id]/[year]/[month]│
│                                 │
│  Rajesh Kumar - January 2026    │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Attendance              │   │
│  │ Days Present:    22     │   │
│  │ Days Absent:      5     │   │
│  │ Holidays:         3     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Earnings                │   │
│  │ Base Salary:  ₹10,000   │   │
│  │ Bhatta:       ₹6,600    │   │
│  │ Total Earned: ₹16,600   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Advances                │   │
│  │ 05 Jan  Fuel    ₹2,000  │   │
│  │ 15 Jan  Emerg.  ₹1,500  │   │
│  │ Total Advances: ₹3,500  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ NET PAYABLE: ₹13,100    │   │
│  │         (green)         │   │
│  └─────────────────────────┘   │
│                                 │
│  [Mark as Settled]              │
└─────────────────────────────────┘
           │ Click
           ▼
┌─────────────────────────────────┐
│  ✓ Settled                      │
│  Paid on 31 Jan 2026            │
└─────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │
│  (Next.js)   │
└───────┬──────┘
        │
        │ HTTP Requests
        │
        ▼
┌──────────────────┐
│  Next.js Server  │
│  (API Routes)    │
└────────┬─────────┘
         │
         │ SQL Queries
         │
         ▼
┌──────────────────┐
│   Supabase       │
│   (PostgreSQL)   │
│                  │
│  ┌────────────┐  │
│  │  drivers   │  │
│  ├────────────┤  │
│  │ attendance │  │
│  ├────────────┤  │
│  │  advances  │  │
│  ├────────────┤  │
│  │settlements │  │
│  └────────────┘  │
└──────────────────┘
```

## State Management Flow

```
User Action (Tap Date)
        │
        ▼
Client Component (AttendanceCalendar)
        │
        ▼
API Call (POST /api/attendance)
        │
        ▼
Server Action
        │
        ▼
Supabase Insert/Update
        │
        ▼
Database Updated
        │
        ▼
Response to Client
        │
        ▼
Update Local State
        │
        ▼
Re-render Calendar (Date color changes)
```

## Authentication Flow

```
┌─────────────┐
│ User visits │
│   any page  │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│   Middleware     │
│ Check auth token │
└────┬─────────┬───┘
     │         │
     │ No      │ Yes
     │ Token   │ Token
     │         │
     ▼         ▼
┌─────────┐  ┌──────────┐
│Redirect │  │ Allow    │
│to /login│  │ Access   │
└─────────┘  └──────────┘
```

## Calculation Flow

```
Month End
    │
    ▼
┌─────────────────────────────────┐
│  Gather Data                    │
│  - Get all attendance records   │
│  - Get all advance records      │
│  - Get driver base salary       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Calculate                      │
│  1. Count days present          │
│  2. Bhatta = days × rate        │
│  3. Total earned = base + bhatta│
│  4. Sum all advances            │
│  5. Net = earned - advances     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Display Settlement             │
│  - Show breakdown               │
│  - Color code net payable       │
│  - Allow mark as settled        │
└─────────────────────────────────┘
```

## Database Relationships

```
┌──────────────┐
│   drivers    │
│              │
│  id (PK)     │◄─────┐
│  name        │      │
│  phone       │      │
│  base_salary │      │
│  bhatta_rate │      │
└──────────────┘      │
                      │
                      │ driver_id (FK)
                      │
        ┌─────────────┼─────────────┬─────────────┐
        │             │             │             │
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│  attendance  │ │ advances │ │settlements│ │              │
│              │ │          │ │           │ │              │
│  id (PK)     │ │ id (PK)  │ │ id (PK)   │ │              │
│  driver_id   │ │driver_id │ │driver_id  │ │              │
│  date        │ │ date     │ │ month     │ │              │
│  status      │ │ amount   │ │ year      │ │              │
│              │ │ note     │ │net_payable│ │              │
└──────────────┘ └──────────┘ └──────────┘ └──────────────┘
```

## Component Hierarchy

```
App
│
├── Layout
│   └── globals.css
│
├── Login Page
│   └── Login Form
│
├── Dashboard Page
│   ├── Driver Card (multiple)
│   │   ├── Driver Info
│   │   ├── Stats
│   │   └── Action Buttons
│   └── Add Driver Button
│
├── Driver Detail Page
│   ├── Driver Header
│   ├── AttendanceCalendar (Client Component)
│   │   └── Calendar Grid
│   ├── Advances List
│   └── Net Payable Bar
│
├── Add Driver Page
│   └── Driver Form
│
├── Add Advance Page
│   └── Advance Form
│
└── Settlement Page
    ├── Attendance Summary
    ├── Earnings Breakdown
    ├── Advances List
    ├── Net Payable Display
    └── Mark Settled Button
```

## API Routes

```
/api/attendance
    │
    ├── POST   → Create/Update attendance
    │            Input: { driverId, date, status }
    │            Output: { success: true }
    │
    └── DELETE → Remove attendance
                 Input: { driverId, date }
                 Output: { success: true }
```

## Color Coding System

```
Attendance Status:
🟢 Green (#22c55e)  → Present (earns bhatta)
🔴 Red (#ef4444)    → Absent (no bhatta)
⚫ Grey (#9ca3af)   → Holiday (no bhatta)
⚪ White            → Unmarked (treated as absent)

Financial Status:
🟢 Green → Positive balance (owner pays driver)
🔴 Red   → Negative balance (driver owes owner)
🟡 Amber → Advance given
```

## Mobile Interaction Patterns

```
Tap Date in Calendar:
┌─────────┐
│ Unmarked│ ──tap──► Present
└─────────┘
     ▲                  │
     │                  │ tap
     │                  ▼
  Holiday          ┌─────────┐
     ▲             │ Present │
     │             └─────────┘
     │ tap              │
     │                  │ tap
┌─────────┐            ▼
│ Absent  │◄──tap── Absent
└─────────┘
```

## Typical Monthly Workflow

```
Day 1-30: Daily Operations
    │
    ├─► Mark attendance daily
    │   (tap dates in calendar)
    │
    └─► Record advances as given
        (use Add Advance form)

Day 31: Month End
    │
    ├─► Review attendance
    │   (check calendar is complete)
    │
    ├─► Verify advances
    │   (check all recorded)
    │
    ├─► View settlement
    │   (review calculation)
    │
    ├─► Pay driver
    │   (transfer money)
    │
    └─► Mark as settled
        (record in system)
```

## Error Handling Flow

```
User Action
    │
    ▼
Try Operation
    │
    ├─► Success → Update UI → Show feedback
    │
    └─► Error
        │
        ├─► Network Error → Show "Check connection"
        │
        ├─► Auth Error → Redirect to login
        │
        └─► Validation Error → Show error message
```

---

**This diagram shows the complete flow of the Sarathi application. Use it to understand how different parts connect.**
