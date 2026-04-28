'use client'

import { useState } from 'react'
import { getDaysInMonth, getFirstDayOfMonth, getMonthName } from '@/lib/utils'
import { AttendanceStatus } from '@/lib/types'

type AttendanceCalendarProps = {
  driverId: string
  month: number
  year: number
  attendanceMap: Map<string, AttendanceStatus>
}

export default function AttendanceCalendar({
  driverId,
  month,
  year,
  attendanceMap,
}: AttendanceCalendarProps) {
  const [localAttendance, setLocalAttendance] = useState(attendanceMap)
  const [isUpdating, setIsUpdating] = useState(false)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = getFirstDayOfMonth(year, month)

  const cycleStatus = (currentStatus: AttendanceStatus | undefined): AttendanceStatus | null => {
    if (!currentStatus) return 'present'
    if (currentStatus === 'present') return 'absent'
    if (currentStatus === 'absent') return 'holiday'
    return null
  }

  const handleDateClick = async (day: number) => {
    if (isUpdating) return

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const currentStatus = localAttendance.get(dateStr)
    const newStatus = cycleStatus(currentStatus)

    setIsUpdating(true)

    try {
      if (newStatus === null) {
        await fetch('/api/attendance', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ driverId, date: dateStr }),
        })
        const newMap = new Map(localAttendance)
        newMap.delete(dateStr)
        setLocalAttendance(newMap)
      } else {
        await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ driverId, date: dateStr, status: newStatus }),
        })
        const newMap = new Map(localAttendance)
        newMap.set(dateStr, newStatus)
        setLocalAttendance(newMap)
      }
    } catch (error) {
      console.error('Failed to update attendance:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: AttendanceStatus | undefined) => {
    if (!status) return 'bg-white'
    if (status === 'present') return 'bg-green-500'
    if (status === 'absent') return 'bg-red-500'
    if (status === 'holiday') return 'bg-gray-400'
    return 'bg-white'
  }

  const emptyDays = Array(firstDayOfWeek).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {getMonthName(month)} {year}
        </h2>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>P</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>A</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span>H</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day) => {
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const status = localAttendance.get(dateStr)
          const isFuture = new Date(dateStr) > new Date()

          return (
            <button
              key={day}
              onClick={() => !isFuture && handleDateClick(day)}
              disabled={isFuture || isUpdating}
              className={`aspect-square rounded-lg border-2 border-gray-200 flex items-center justify-center text-lg font-semibold ${
                isFuture ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-900">{day}</span>
                <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(status)}`} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
