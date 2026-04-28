import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DriversListContent from '@/components/DriversListContent'

export const dynamic = 'force-dynamic'

export default async function DriversPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: activeDrivers } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const { data: inactiveDrivers } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', false)
    .order('created_at', { ascending: false })

  return <DriversListContent activeDrivers={activeDrivers || []} inactiveDrivers={inactiveDrivers || []} />
}
