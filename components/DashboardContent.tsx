'use client'

import { useState } from 'react'
import { Truck, IndianRupee, HardHat, CheckCircle2, XCircle, Coffee } from 'lucide-react'
import RoadMotif from './RoadMotif'
import BottomSheet from './BottomSheet'
import Toast from './Toast'
import { Driver } from '@/lib/types'

type DriverWithStats = Driver & {
  todayStatus: string | null
  daysPresent: number
  totalAdvances: number
  netPayable: number
}

export default function DashboardContent({ drivers }: { drivers: DriverWithStats[] }) {
  const [selectedDriver, setSelectedDriver] = useState<DriverWithStats | null>(null)
  const [advanceDriver, setAdvanceDriver] = useState<DriverWithStats | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const today = new Date()
  const dayName = today.toLocaleDateString('hi-IN', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const presentCount = drivers.filter(d => d.todayStatus === 'present').length
  const absentCount = drivers.filter(d => d.todayStatus === 'absent').length
  const holidayCount = drivers.filter(d => d.todayStatus === 'holiday').length

  const handleMarkAll = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      await Promise.all(
        drivers.map(driver =>
          fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              driverId: driver.id,
              date: today,
              status: 'present',
            }),
          })
        )
      )

      setToast({ message: 'Sab mark ho gaye ✓', type: 'success' })
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setToast({ message: 'Error marking attendance', type: 'error' })
    }
  }

  const handleStatusChange = async (driverId: string, status: 'present' | 'absent' | 'holiday') => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId,
          date: today,
          status,
        }),
      })

      const driver = drivers.find(d => d.id === driverId)
      const statusText = status === 'present' ? 'Aaya' : status === 'absent' ? 'Nahi Aaya' : 'Chutti'
      setToast({ message: `${driver?.name} — ${statusText} mark ho gaya ✓`, type: 'success' })
      
      setTimeout(() => {
        setSelectedDriver(null)
        window.location.reload()
      }, 400)
    } catch (error) {
      setToast({ message: 'Error updating attendance', type: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 relative overflow-hidden">
        <RoadMotif />
        <div className="relative z-10 px-4 py-4 max-w-[480px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="text-orange-500" size={28} strokeWidth={2.5} />
              <h1 className="text-2xl font-bold text-orange-500">SARATHI</h1>
            </div>
            <button className="p-2 hover:bg-slate-700 rounded-full transition-colors">
              <IndianRupee className="text-orange-500" size={24} />
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">{dayName}, {dateStr}</p>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 py-4 space-y-4">
        {/* Mark All Present Button */}
        <button
          onClick={handleMarkAll}
          className="w-full bg-green-500/15 border border-green-500/40 rounded-2xl p-4 flex items-center justify-between btn-press"
        >
          <div className="text-left">
            <div className="flex items-center gap-2 text-green-400 font-semibold text-lg">
              <CheckCircle2 size={24} />
              <span>Aaj Sab Aaye?</span>
            </div>
            <p className="text-sm text-green-400/70 mt-1">Sabko Present mark karo ek tap mein</p>
          </div>
        </button>

        {/* Summary Bar */}
        <div className="text-sm text-slate-400 flex items-center gap-2">
          <span>{drivers.length} drivers</span>
          <span>·</span>
          <span className="text-green-400">{presentCount} aaye</span>
          <span>·</span>
          <span className="text-red-400">{absentCount} nahi aaye</span>
          <span>·</span>
          <span className="text-slate-400">{holidayCount} chutti</span>
        </div>

        {/* Driver Cards */}
        <div className="space-y-3">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <HardHat className="text-slate-400" size={20} />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{driver.name}</h3>
                    {driver.todayStatus && (
                      <p className={`text-[13px] flex items-center gap-1 ${
                        driver.todayStatus === 'present' ? 'text-green-400' :
                        driver.todayStatus === 'absent' ? 'text-red-400' :
                        'text-slate-400'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {driver.todayStatus === 'present' ? 'Present today' :
                         driver.todayStatus === 'absent' ? 'Absent today' :
                         'Holiday today'}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setAdvanceDriver(driver)}
                  className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center btn-press"
                >
                  <IndianRupee className="text-amber-500" size={20} />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(driver.id, 'present')}
                  className={`flex-1 h-10 rounded-full flex items-center justify-center gap-1.5 text-sm font-medium transition-all btn-press ${
                    driver.todayStatus === 'present'
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                  style={{ opacity: driver.todayStatus && driver.todayStatus !== 'present' ? 0.3 : 1 }}
                >
                  <CheckCircle2 size={16} />
                  <span>Aaya</span>
                </button>
                <button
                  onClick={() => handleStatusChange(driver.id, 'absent')}
                  className={`flex-1 h-10 rounded-full flex items-center justify-center gap-1.5 text-sm font-medium transition-all btn-press ${
                    driver.todayStatus === 'absent'
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                  style={{ opacity: driver.todayStatus && driver.todayStatus !== 'absent' ? 0.3 : 1 }}
                >
                  <XCircle size={16} />
                  <span>Nahi Aaya</span>
                </button>
                <button
                  onClick={() => handleStatusChange(driver.id, 'holiday')}
                  className={`flex-1 h-10 rounded-full flex items-center justify-center gap-1.5 text-sm font-medium transition-all btn-press ${
                    driver.todayStatus === 'holiday'
                      ? 'bg-slate-600 text-slate-300'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                  style={{ opacity: driver.todayStatus && driver.todayStatus !== 'holiday' ? 0.3 : 1 }}
                >
                  <Coffee size={16} />
                  <span>Chutti</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Advance Bottom Sheet */}
      <BottomSheet
        isOpen={!!advanceDriver}
        onClose={() => setAdvanceDriver(null)}
        title={`Advance - ${advanceDriver?.name}`}
      >
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">Quick advance entry coming soon...</p>
        </div>
      </BottomSheet>
    </div>
  )
}
