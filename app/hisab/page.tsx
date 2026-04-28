import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HisabContent from '@/components/HisabContent'

export const dynamic = 'force-dynamic'

export default async function HisabPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: drivers } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const { data: settlements } = await supabase
    .from('settlements')
    .select(`
      *,
      drivers (name)
    `)
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  return <HisabContent drivers={drivers || []} settlements={settlements || []} />
}
