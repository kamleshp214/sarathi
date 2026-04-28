'use client'

import { useState } from 'react'
import { Truck, IndianRupee, HardHat, CheckCircle2, XCircle, Coffee, ChevronRight, Users } from 'lucide-react'
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
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [advanceNote, setAdvanceNote] = useState('')
  const [advanceDate, setAdvanceDate] = useState(new Date().toISOString().split('T')[0])
  const [amountError, setAmountError] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [optimisticStates, setOptimisticStates] = useState<Record<string, string>>({})

  const today = new Date()
  const dayName = today.toLocaleDateString('hi-IN', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const presentCount = drivers.filter(d => (optimisticStates[d.id] || d.todayStatus) === 'present').length
  const absentCount = drivers.filter(d => (optimisticStates[d.id] || d.todayStatus) === 'absent').length
  const holidayCount = drivers.filter(d => (optimisticStates[d.id] || d.todayStatus) === 'holiday').length

  const handleMarkAll = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Optimistic update
      const newStates: Record<string, string> = {}
      drivers.forEach(d => { newStates[d.id] = 'present' })
      setOptimisticStates(newStates)
      
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
      setOptimisticStates({})
      setToast({ message: 'Error marking attendance', type: 'error' })
    }
  }

  const handleStatusChange = async (driverId: string, status: 'present' | 'absent' | 'holiday') => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Optimistic update
      setOptimisticStates(prev => ({ ...prev, [driverId]: status }))
      
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
    } catch (error) {
      // Revert on error
      setOptimisticStates(prev => {
        const newState = { ...prev }
        delete newState[driverId]
        return newState
      })
      setToast({ message: 'Error updating attendance', type: 'error' })
    }
  }

  const handleSaveAdvance = async () => {
    if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
      setAmountError(true)
      setTimeout(() => setAmountError(false), 500)
      return
    }

    try {
      const response = await fetch('/api/advances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: advanceDriver?.id,
          amount: parseFloat(advanceAmount),
          note: advanceNote,
          date: advanceDate,
        }),
      })

      if (response.ok) {
        setToast({ 
          message: `${advanceDriver?.name} — ₹${advanceAmount} advance save ho gaya`, 
          type: 'success' 
        })
        setAdvanceDriver(null)
        setAdvanceAmount('')
        setAdvanceNote('')
        setAdvanceDate(new Date().toISOString().split('T')[0])
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setToast({ message: 'Error saving advance', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error saving advance', type: 'error' })
    }
  }

  const getDriverStatus = (driver: DriverWithStats) => {
    return optimisticStates[driver.id] || driver.todayStatus
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-orange-500/30 relative overflow-hidden">
        <RoadMotif />
        <div className="relative z-10 px-3 py-4 max-w-[480px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="text-orange-500" size={24} strokeWidth={2.5} />
              <h1 className="text-2xl font-black text-orange-500 tracking-tight">SARATHI</h1>
            </div>
          </div>
          <p className="text-[13px] text-slate-500 mt-1 font-normal">{dayName}, {dateStr}</p>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-3 py-3 space-y-3">
        {/* Mark All Present Button */}
        <button
          onClick={handleMarkAll}
          className="w-full bg-gradient-to-br from-green-900 to-green-800 border border-green-500 rounded-[14px] p-3.5 flex items-center justify-between btn-press"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={32} className="text-green-400" strokeWidth={2} />
            <div className="text-left">
              <div className="text-green-300 font-bold text-lg">Aaj Sab Aaye?</div>
              <p className="text-[13px] text-green-600 mt-0.5">Ek tap mein sab present</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-green-600" />
        </button>

        {/* Summary Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 bg-slate-700/15 border border-slate-700/40 rounded-full px-2.5 py-1 whitespace-nowrap">
            <Users size={14} className="text-slate-400" />
            <span className="text-[13px] font-semibold text-slate-400">{drivers.length}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/40 rounded-full px-2.5 py-1 whitespace-nowrap">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="text-[13px] font-semibold text-green-400">{presentCount} Aaye</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 rounded-full px-2.5 py-1 whitespace-nowrap">
            <XCircle size={14} className="text-red-400" />
            <span className="text-[13px] font-semibold text-red-400">{absentCount} Nahi</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-500/15 border border-slate-500/40 rounded-full px-2.5 py-1 whitespace-nowrap">
            <Coffee size={14} className="text-slate-400" />
            <span className="text-[13px] font-semibold text-slate-400">{holidayCount} Chutti</span>
          </div>
        </div>

        {/* Driver Cards */}
        <div className="space-y-2">
          {drivers.map((driver) => {
            const status = getDriverStatus(driver)
            const borderColor = 
              status === 'present' ? 'border-l-green-500' :
              status === 'absent' ? 'border-l-red-500' :
              status === 'holiday' ? 'border-l-slate-400' :
              'border-l-slate-700'

            return (
              <div
                key={driver.id}
                className={`bg-slate-800 border border-slate-700 ${borderColor} border-l-4 rounded-2xl p-3.5`}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2 flex-1">
                    <HardHat className="text-slate-400" size={20} />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 leading-tight">{driver.name}</h3>
                      {status && (
                        <p className={`text-[13px] flex items-center gap-1 mt-0.5 ${
                          status === 'present' ? 'text-green-400' :
                          status === 'absent' ? 'text-red-400' :
                          'text-slate-400'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {status === 'present' ? 'Aaya — Aaj' :
                           status === 'absent' ? 'Nahi Aaya — Aaj' :
                           'Chutti — Aaj'}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setAdvanceDriver(driver)}
                    className="w-11 h-11 rounded-full bg-amber-950 border border-amber-500 flex items-center justify-center btn-press flex-shrink-0"
                  >
                    <IndianRupee className="text-amber-500" size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(driver.id, 'present')}
                    className={`flex-1 h-11 rounded-[10px] flex items-center justify-center gap-1.5 text-sm font-medium transition-all btn-press ${
                      status === 'present'
                        ? 'bg-green-900 border border-green-500 text-green-500 font-bold'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    <span>Aaya</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(driver.id, 'absent')}
                    className={`flex-1 h-11 rounded-[10px] flex items-center justify-center gap-1.5 text-sm font-medium transition-all btn-press ${
                      status === 'absent'
                        ? 'bg-red-900 border border-red-500 text-red-500 font-bold'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}
                  >
                    <XCircle size={16} />
                    <span>Nahi Aaya</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(driver.id, 'holiday')}
                    className={`flex-1 h-11 rounded-[10px] flex items-center justify-center gap-1.5 text-sm font-medium transition-all btn-press ${
                      status === 'holiday'
                        ? 'bg-slate-800 border border-slate-400 text-slate-400 font-bold'
                        : 'bg-slate-900 border border-slate-700 text-slate-500'
                    }`}
                  >
                    <Coffee size={16} />
                    <span>Chutti</span>
                  </button>
                </div>
              </div>
            )
          })}
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
        onClose={() => {
          setAdvanceDriver(null)
          setAdvanceAmount('')
          setAdvanceNote('')
          setAdvanceDate(new Date().toISOString().split('T')[0])
          setAmountError(false)
        }}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100">{advanceDriver?.name} ke liye Advance</h3>
            <p className="text-[13px] text-slate-400 mt-1">
              Aaj ka: {new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="h-px bg-slate-700" />

          {/* Amount */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              KITNA DIYA?
            </label>
            <div className={`relative ${amountError ? 'animate-shake' : ''}`}>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[32px] font-bold text-amber-500">₹</span>
              <input
                type="number"
                value={advanceAmount}
                onChange={(e) => {
                  setAdvanceAmount(e.target.value)
                  setAmountError(false)
                }}
                placeholder="0"
                className="w-full h-[72px] pl-14 pr-4 bg-slate-700 border border-slate-600 rounded-xl text-[32px] font-bold text-center text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {amountError && (
              <p className="text-red-400 text-sm mt-2">Amount likhna zaroori hai</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              KISLIYE?
            </label>
            <input
              type="text"
              value={advanceNote}
              onChange={(e) => setAdvanceNote(e.target.value)}
              placeholder="Petrol, ghar, emergency..."
              className="w-full h-[52px] px-4 bg-slate-700 border border-slate-600 rounded-xl text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              KAUNSI TARIKH?
            </label>
            <input
              type="date"
              value={advanceDate}
              onChange={(e) => setAdvanceDate(e.target.value)}
              className="w-full h-[52px] px-4 bg-slate-700 border border-slate-600 rounded-xl text-base text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="h-px bg-slate-700" />

          {/* Save Button */}
          <button
            onClick={handleSaveAdvance}
            className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-[14px] text-lg font-bold flex items-center justify-center gap-2 btn-press"
          >
            <IndianRupee size={20} strokeWidth={2.5} />
            <span>Advance Save Karo</span>
          </button>

          {/* Cancel */}
          <button
            onClick={() => {
              setAdvanceDriver(null)
              setAdvanceAmount('')
              setAdvanceNote('')
              setAdvanceDate(new Date().toISOString().split('T')[0])
              setAmountError(false)
            }}
            className="w-full text-center text-slate-400 text-sm"
          >
            Rehne do
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}

<style jsx>{`
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  .animate-shake {
    animation: shake 0.3s ease-in-out;
  }
`}</style>
