'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Truck, Users, Receipt, Settings } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { href: '/dashboard', icon: Truck, label: 'Aaj', match: '/dashboard' },
    { href: '/drivers', icon: Users, label: 'Drivers', match: '/drivers' },
    { href: '/hisab', icon: Receipt, label: 'Hisab', match: '/hisab' },
    { href: '/settings', icon: Settings, label: 'Settings', match: '/settings' },
  ]

  const isActive = (match: string) => {
    if (match === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    if (match === '/hisab') return pathname.startsWith('/hisab') || pathname.startsWith('/settlement')
    return pathname.startsWith(match)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-[480px] mx-auto">
        <div className="grid grid-cols-4 h-[68px]">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = isActive(tab.match)
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 relative transition-colors ${
                  active ? 'text-orange-500' : 'text-slate-600'
                }`}
              >
                {active && (
                  <div className="absolute top-2 w-1.5 h-1.5 rounded-full bg-orange-500" />
                )}
                <Icon size={24} strokeWidth={2} />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
