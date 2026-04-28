'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Receipt, ChevronDown, BadgeCheck, Clock } from 'lucide-react'
import BottomNav from './BottomNav'
import { Driver } from '@/lib/types'
import { formatCurrency, getMonthName } from '@/lib/utils'

type Settlement = {
  id: string
  driver_id: string
  month: number
  year: number
  net_payable: number
  is_paid: boolean
  paid_at: string | null
  drivers: { name: string } | null
}

export default function HisabContent({ 
  drivers, 
  settlements 
}: { 
  drivers: Driver[]
  settlements: Settlement[]
}) {
  const router = useRouter()
  const [selectedDriver, setSelectedDriver] = useState(drivers[0]?.id || '')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const handleViewSettlement = () => {
    if (selectedDriver) {
      router.push(`/settlement/${selectedDriver}/${selectedYear}/${selectedMonth}`)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-orange-500/30">
          <div className="max-w-[480px] mx-auto px-3 py-4">
            <div className="flex items-center gap-2">
              <Receipt className="text-orange-500" size={24} strokeWidth={2.5} />
              <h1 className="text-2xl font-black text-orange-500 tracking-tight">HISAB</h1>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">Settlement dekho aur manage karo</p>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto px-3 py-4 space-y-4">
          {/* Driver Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              DRIVER CHUNIYE
            </label>
            <div className="relative">
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full h-14 px-4 pr-10 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-[17px] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Month/Year Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                MAHINA
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full h-14 px-4 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-[17px] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                SAAL
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full h-14 px-4 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 text-[17px] appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Button */}
          <button
            onClick={handleViewSettlement}
            disabled={!selectedDriver}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-[14px] text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-press"
          >
            Dekho Hisab
          </button>

          {/* Past Settlements */}
          {settlements.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">
                PICHLE SETTLEMENTS
              </h2>
              <div className="space-y-2">
                {settlements.map((settlement) => (
                  <button
                    key={settlement.id}
                    onClick={() => router.push(`/settlement/${settlement.driver_id}/${settlement.year}/${settlement.month}`)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-left btn-press"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-100 font-semibold">
                          {settlement.drivers?.name || 'Unknown Driver'}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {getMonthName(settlement.month)} {settlement.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${settlement.net_payable >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(settlement.net_payable)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {settlement.is_paid ? (
                            <>
                              <BadgeCheck size={14} className="text-green-400" />
                              <span className="text-xs text-green-400">Paid</span>
                            </>
                          ) : (
                            <>
                              <Clock size={14} className="text-amber-400" />
                              <span className="text-xs text-amber-400">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
