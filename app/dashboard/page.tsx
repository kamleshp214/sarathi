import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
  const firstDay = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0]
  const lastDay = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]

  const driversWithStats = await Promise.all(
    drivers.map(async (driver) => {
      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('driver_id', driver.id)
        .gte('date', firstDay)
        .lte('date', lastDay)
        .eq('status', 'present')

      const { data: advances } = await supabase
        .from('advances')
        .select('amount')
        .eq('driver_id', driver.id)
        .gte('date', firstDay)
        .lte('date', lastDay)

      const daysPresent = attendance?.length || 0
      const totalAdvances = advances?.reduce((sum, adv) => sum + adv.amount, 0) || 0

      return {
        ...driver,
        daysPresent,
        totalAdvances,
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Sarathi</h1>
          <p className="text-sm text-gray-600">Driver Management</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Link
          href="/drivers/new"
          className="block w-full bg-green-600 text-white text-center py-4 rounded-lg text-lg font-semibold active:bg-green-700"
        >
          + Add New Driver
        </Link>

        {drivers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No drivers added yet</p>
            <p className="text-sm mt-2">Tap the button above to add your first driver</p>
          </div>
        ) : (
          <div className="space-y-3">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{driver.name}</h2>
                    <p className="text-sm text-gray-600">{driver.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-lg font-semibold text-green-600">{driver.daysPresent} days</p>
                  </div>
                </div>

                <div className="mb-3 pb-3 border-b border-gray-100">
                  <p className="text-sm text-gray-600">Advances Given</p>
                  <p className="text-lg font-semibold text-amber-600">
                    {formatCurrency(driver.totalAdvances)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/drivers/${driver.id}`}
                    className="bg-blue-600 text-white text-center py-3 rounded-lg font-semibold active:bg-blue-700"
                  >
                    Attendance
                  </Link>
                  <Link
                    href={`/advances/new?driverId=${driver.id}`}
                    className="bg-amber-600 text-white text-center py-3 rounded-lg font-semibold active:bg-amber-700"
                  >
                    Add Advance
                  </Link>
                </div>

                <Link
                  href={`/settlement/${driver.id}/${new Date().getFullYear()}/${new Date().getMonth() + 1}`}
                  className="block mt-2 bg-gray-100 text-gray-900 text-center py-3 rounded-lg font-semibold active:bg-gray-200"
                >
                  View Settlement
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
