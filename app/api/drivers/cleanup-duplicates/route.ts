import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()

  // Get all active drivers
  const { data: drivers } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!drivers) {
    return NextResponse.json({ error: 'No drivers found' }, { status: 404 })
  }

  // Group by name (case-insensitive)
  const grouped: Record<string, Array<{ id: string; name: string; created_at: string }>> = {}
  
  for (const driver of drivers) {
    const key = driver.name.toLowerCase()
    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(driver)
  }

  // For each group with duplicates, keep the most recent, deactivate others
  const toDeactivate: string[] = []
  
  for (const key in grouped) {
    const group = grouped[key]
    if (group && group.length > 1) {
      // Keep the first one (most recent due to ordering), deactivate the rest
      for (let i = 1; i < group.length; i++) {
        toDeactivate.push(group[i].id)
      }
    }
  }

  if (toDeactivate.length > 0) {
    const { error } = await supabase
      .from('drivers')
      .update({ is_active: false })
      .in('id', toDeactivate)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, deactivated: toDeactivate.length })
}
