'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HardHat, MoreVertical, UserPlus, Pencil, UserX, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import BottomNav from './BottomNav'
import Toast from './Toast'
import { Driver } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export default function DriversListContent({ 
  activeDrivers, 
  inactiveDrivers 
}: { 
  activeDrivers: Driver[]
  inactiveDrivers: Driver[]
}) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [showInactive, setShowInactive] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Check for duplicates
  const driverNames = activeDrivers.map(d => d.name.toLowerCase())
  const duplicates = driverNames.filter((name, index) => driverNames.indexOf(name) !== index)
  const hasDuplicates = duplicates.length > 0

  const handleDeactivate = async (driverId: string, driverName: string) => {
    try {
      const response = await fetch('/api/drivers/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      })

      if (response.ok) {
        setToast({ message: `${driverName} ko hataya gaya. Unka data safe hai.`, type: 'success' })
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setToast({ message: 'Error deactivating driver', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error deactivating driver', type: 'error' })
    }
    setShowMenu(null)
  }

  const handleReactivate = async (driverId: string, driverName: string) => {
    try {
      const response = await fetch('/api/drivers/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      })

      if (response.ok) {
        setToast({ message: `${driverName} ko wapas activate kiya gaya`, type: 'success' })
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setToast({ message: 'Error reactivating driver', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error reactivating driver', type: 'error' })
    }
  }

  const handleCleanupDuplicates = async () => {
    try {
      const response = await fetch('/api/drivers/cleanup-duplicates', {
        method: 'POST',
      })

      if (response.ok) {
        setToast({ message: 'Duplicate drivers ko clean kar diya gaya', type: 'success' })
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setToast({ message: 'Error cleaning up duplicates', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error cleaning up duplicates', type: 'error' })
    }
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-b border-orange-500/30">
          <div className="max-w-[480px] mx-auto px-3 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <HardHat className="text-orange-500" size={24} strokeWidth={2.5} />
                  <h1 className="text-2xl font-black text-orange-500 tracking-tight">DRIVERS</h1>
                </div>
                <p className="text-[13px] text-slate-500 mt-1">{activeDrivers.length} active</p>
              </div>
              <button
                onClick={() => router.push('/drivers/new')}
                className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center btn-press"
              >
                <UserPlus className="text-white" size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto px-3 py-4 space-y-3">
          {/* Duplicate Warning */}
          {hasDuplicates && (
            <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-amber-400 text-sm font-semibold">Duplicate drivers detected</p>
                  <p className="text-amber-400/70 text-xs mt-1">Clean up karo</p>
                </div>
                <button
                  onClick={handleCleanupDuplicates}
                  className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg btn-press"
                >
                  Cleanup
                </button>
              </div>
            </div>
          )}

          {/* Active Drivers */}
          {activeDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-4 relative"
            >
              <button
                onClick={() => router.push(`/drivers/${driver.id}`)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <HardHat className="text-slate-400" size={20} />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100">{driver.name}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {formatCurrency(driver.base_salary)}/month · ₹{driver.bhatta_rate} bhatta
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Joined: {new Date(driver.joining_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </button>

              {/* More Options */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(showMenu === driver.id ? null : driver.id)
                }}
                className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <MoreVertical className="text-slate-400" size={18} />
              </button>

              {/* Action Menu */}
              {showMenu === driver.id && (
                <div className="absolute top-14 right-4 bg-slate-700 border border-slate-600 rounded-xl shadow-lg overflow-hidden z-10 min-w-[160px]">
                  <button
                    onClick={() => {
                      router.push(`/drivers/${driver.id}/edit`)
                      setShowMenu(null)
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 text-slate-200 hover:bg-slate-600 transition-colors text-left"
                  >
                    <Pencil size={16} />
                    <span className="text-sm">Edit Driver</span>
                  </button>
                  <button
                    onClick={() => handleDeactivate(driver.id, driver.name)}
                    className="w-full px-4 py-3 flex items-center gap-2 text-red-400 hover:bg-slate-600 transition-colors text-left"
                  >
                    <UserX size={16} />
                    <span className="text-sm">Deactivate</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Inactive Drivers Section */}
          {inactiveDrivers.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowInactive(!showInactive)}
                className="w-full flex items-center justify-between py-2 text-slate-400 hover:text-slate-300"
              >
                <span className="text-xs uppercase tracking-wider font-semibold">
                  Inactive Drivers ({inactiveDrivers.length})
                </span>
                {showInactive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showInactive && (
                <div className="space-y-2 mt-2">
                  {inactiveDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 opacity-60"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <HardHat className="text-slate-500" size={18} />
                          <div>
                            <h3 className="text-base font-semibold text-slate-300">{driver.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formatCurrency(driver.base_salary)}/month
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleReactivate(driver.id, driver.name)}
                          className="px-3 py-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold rounded-lg btn-press"
                        >
                          Reactivate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => router.push('/drivers/new')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-orange-500 rounded-full shadow-lg flex items-center justify-center btn-press z-40"
        >
          <UserPlus className="text-white" size={24} strokeWidth={2.5} />
        </button>
      </div>

      <BottomNav />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => setShowMenu(null)}
        />
      )}
    </>
  )
}
