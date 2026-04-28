export type Driver = {
  id: string
  name: string
  phone: string
  base_salary: number
  bhatta_rate: number
  joining_date: string
  is_active: boolean
  created_at: string
}

export type AttendanceStatus = 'present' | 'absent' | 'holiday'

export type Attendance = {
  id: string
  driver_id: string
  date: string
  status: AttendanceStatus
  created_at: string
}

export type Advance = {
  id: string
  driver_id: string
  date: string
  amount: number
  note: string | null
  created_at: string
}

export type Settlement = {
  id: string
  driver_id: string
  month: number
  year: number
  net_payable: number
  is_paid: boolean
  paid_at: string | null
  created_at: string
}
