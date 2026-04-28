import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { Settings as SettingsIcon } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 pb-20">
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-[480px] mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <SettingsIcon className="text-orange-500" size={24} />
              <h1 className="text-xl font-bold text-slate-100">Settings</h1>
            </div>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto px-4 py-12 text-center">
          <p className="text-slate-400 text-lg">Coming soon...</p>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
