import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, getMonthName } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function SettlementPage({
  params,
}: {
  params: Promise<{ driverId: string; year: string; month: string }>
}) {
  const { driverId, year: yearStr, month: monthStr } = await params
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)
  
  const supabase = await createClient()
  
  const { data: driver } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single()

  if (!driver) {
    redirect('/dashboard')
  }

  const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const lastDay = new Date(year, month, 0).toISOString().split('T')[0]

  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('*')
    .eq('driver_id', driverId)
    .gte('date', firstDay)
    .lte('date', lastDay)

  const { data: advances } = await supabase
    .from('advances')
    .select('*')
    .eq('driver_id', driverId)
    .gte('date', firstDay)
    .lte('date', lastDay)
    .order('date', { ascending: true })

  const daysPresent = attendanceData?.filter((a) => a.status === 'present').length || 0
  const daysAbsent = attendanceData?.filter((a) => a.status === 'absent').length || 0
  const holidays = attendanceData?.filter((a) => a.status === 'holiday').length || 0

  const bhattaEarned = daysPresent * driver.bhatta_rate
  const totalEarned = driver.base_salary + bhattaEarned
  const totalAdvances = advances?.reduce((sum, adv) => sum + adv.amount, 0) || 0
  const netPayable = totalEarned - totalAdvances

  const { data: existingSettlement } = await supabase
    .from('settlements')
    .select('*')
    .eq('driver_id', driverId)
    .eq('month', month)
    .eq('year', year)
    .single()

  async function markAsSettled() {
    'use server'
    
    const supabase = await createClient()
    
    await supabase.from('settlements').upsert(
      {
        driver_id: driverId,
        month,
        year,
        net_payable: netPayable,
        is_paid: true,
        paid_at: new Date().toISOString(),
      },
      { onConflict: 'driver_id,month,year' }
    )

    revalidatePath(`/settlement/${driverId}/${year}/${month}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <Link href={`/drivers/${driverId}`} className="text-blue-600 text-sm mb-2 inline-block">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
          <p className="text-lg text-gray-600">
            {getMonthName(month)} {year}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Attendance</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Days Present:</span>
              <span className="font-semibold text-green-600">{daysPresent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Days Absent:</span>
              <span className="font-semibold text-red-600">{daysAbsent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Holidays:</span>
              <span className="font-semibold text-gray-600">{holidays}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Earnings</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Base Salary:</span>
              <span className="font-semibold">{formatCurrency(driver.base_salary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                Bhatta ({daysPresent} days × ₹{driver.bhatta_rate}):
              </span>
              <span className="font-semibold">{formatCurrency(bhattaEarned)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total Earned:</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(totalEarned)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Advances</h2>
          {advances && advances.length > 0 ? (
            <div className="space-y-2 mb-3">
              {advances.map((advance) => (
                <div key={advance.id} className="flex justify-between items-start py-2">
                  <div>
                    <span className="text-gray-700">
                      {new Date(advance.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                    {advance.note && (
                      <span className="text-gray-600 ml-2 text-sm">{advance.note}</span>
                    )}
                  </div>
                  <span className="font-semibold text-amber-600">
                    {formatCurrency(advance.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-3">No advances given</p>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-900">Total Advances:</span>
            <span className="text-lg font-semibold text-amber-600">
              {formatCurrency(totalAdvances)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">NET PAYABLE:</span>
            <span
              className={`text-3xl font-bold ${
                netPayable >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(netPayable)}
            </span>
          </div>
          {netPayable < 0 && (
            <p className="text-sm text-red-600 mt-2 text-center">Driver owes this amount</p>
          )}
        </div>

        {existingSettlement?.is_paid ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-semibold">✓ Settled</p>
            <p className="text-sm text-green-700 mt-1">
              Paid on{' '}
              {new Date(existingSettlement.paid_at!).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        ) : (
          <form action={markAsSettled}>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold active:bg-green-700"
            >
              Mark as Settled
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
