import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { driverId, date, status } = await request.json()

  const { error } = await supabase
    .from('attendance')
    .upsert(
      { driver_id: driverId, date, status },
      { onConflict: 'driver_id,date' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { driverId, date } = await request.json()

  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('driver_id', driverId)
    .eq('date', date)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
