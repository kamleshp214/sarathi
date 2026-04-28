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
  type DriverType = typeof drivers[number]
  const grouped = drivers.reduce((acc, driver) => {
    const key = driver.name.toLowerCase()
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(driver)
    return acc
  }, {} as Record<string, DriverType[]>)

  // For each group with duplicates, keep the most recent, deactivate others
  const toDeactivate: string[] = []
  
  (Object.values(grouped) as DriverType[][]).forEach((group) => {
    if (group.length > 1) {
      // Keep the first one (most recent due to ordering), deactivate the rest
      group.slice(1).forEach((driver) => {
        toDeactivate.push(driver.id)
      })
    }
  })

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
