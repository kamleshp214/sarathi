import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, getDaysInMonth, getFirstDayOfMonth } from '@/lib/utils'
import AttendanceCalendar from '@/components/AttendanceCalendar'
import Link from 'next/link'

export default async function DriverDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const { id } = await params
  const { month: monthParam, year: yearParam } = await searchParams
  
  const supabase = await createClient()
  
  const { data: driver } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single()

  if (!driver) {
    redirect('/dashboard')
  }

  const currentDate = new Date()
  const month = monthParam ? parseInt(monthParam) : currentDate.getMonth() + 1
  const year = yearParam ? parseInt(yearParam) : currentDate.getFullYear()

  const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const lastDay = new Date(year, month, 0).toISOString().split('T')[0]

  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('*')
    .eq('driver_id', id)
    .gte('date', firstDay)
    .lte('date', lastDay)

  const { data: advances } = await supabase
    .from('advances')
    .select('*')
    .eq('driver_id', id)
    .gte('date', firstDay)
    .lte('date', lastDay)
    .order('date', { ascending: false })

  const attendanceMap = new Map(
    attendanceData?.map((a) => [a.date, a.status]) || []
  )

  const daysPresent = attendanceData?.filter((a) => a.status === 'present').length || 0
  const bhattaEarned = daysPresent * driver.bhatta_rate
  const totalEarned = driver.base_salary + bhattaEarned
  const totalAdvances = advances?.reduce((sum, adv) => sum + adv.amount, 0) || 0
  const netPayable = totalEarned - totalAdvances

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 text-sm mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
          <p className="text-sm text-gray-600">{driver.phone}</p>
        </div>
      </div>

      <div className="p-4">
        <AttendanceCalendar
          driverId={id}
          month={month}
          year={year}
          attendanceMap={attendanceMap}
        />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">Advances This Month</h2>
            <Link
              href={`/advances/new?driverId=${id}`}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold active:bg-amber-700"
            >
              + Add
            </Link>
          </div>

          {advances && advances.length > 0 ? (
            <div className="space-y-2">
              {advances.map((advance) => (
                <div
                  key={advance.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm text-gray-600">
                      {new Date(advance.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                    {advance.note && (
                      <p className="text-sm text-gray-900 mt-1">{advance.note}</p>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-amber-600">
                    {formatCurrency(advance.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
              No advances given this month
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-900">Net Payable:</span>
          <span
            className={`text-2xl font-bold ${
              netPayable >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(netPayable)}
          </span>
        </div>
        <Link
          href={`/settlement/${id}/${year}/${month}`}
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold active:bg-blue-700"
        >
          View Full Settlement
        </Link>
      </div>
    </div>
  )
}
