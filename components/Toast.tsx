'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

type ToastProps = {
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 2500, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const borderColor = type === 'success' ? 'border-green-500' : type === 'error' ? 'border-red-500' : 'border-orange-500'

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] flex justify-center toast-enter">
      <div className={`bg-slate-700 border-l-4 ${borderColor} border border-slate-600 rounded-lg px-4 py-3 shadow-lg max-w-md w-full flex items-center justify-between`}>
        <span className="text-slate-100 text-sm">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-3 text-slate-400 hover:text-slate-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
