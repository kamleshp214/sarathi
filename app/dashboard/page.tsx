import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import DashboardContent from '@/components/DashboardContent'

export const dynamic = 'force-dynamic'

async function getDriversWithStats() {
  const supabase = await createClient()
  
  const { data: drivers } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (!drivers) return []

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  const today = currentDate.toISOString().split('T')[0]

  const driversWithStats = await Promise.all(
    drivers.map(async (driver) => {
      // Get today's attendance
      const { data: todayAttendance } = await supabase
        .from('attendance')
        .select('status')
        .eq('driver_id', driver.id)
        .eq('date', today)
        .single()

      // Get this month's stats
      const firstDay = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0]
      const lastDay = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]

      const { data: monthAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('driver_id', driver.id)
        .gte('date', firstDay)
        .lte('date', lastDay)

      const { data: advances } = await supabase
        .from('advances')
        .select('amount')
        .eq('driver_id', driver.id)
        .gte('date', firstDay)
        .lte('date', lastDay)

      const daysPresent = monthAttendance?.filter((a) => a.status === 'present').length || 0
      const totalAdvances = advances?.reduce((sum, adv) => sum + adv.amount, 0) || 0
      const bhattaEarned = daysPresent * driver.bhatta_rate
      const netPayable = driver.base_salary + bhattaEarned - totalAdvances

      return {
        ...driver,
        todayStatus: todayAttendance?.status || null,
        daysPresent,
        totalAdvances,
        netPayable,
      }
    })
  )

  return driversWithStats
}

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const drivers = await getDriversWithStats()

  return (
    <>
      <DashboardContent drivers={drivers} />
      <BottomNav />
    </>
  )
}
