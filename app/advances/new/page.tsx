import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function NewAdvancePage({
  searchParams,
}: {
  searchParams: Promise<{ driverId?: string }>
}) {
  const { driverId: preselectedDriverId } = await searchParams
  const supabase = await createClient()
  
  const { data: drivers } = await supabase
    .from('drivers')
    .select('*')
    .eq('is_active', true)
    .order('name')

  async function createAdvance(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const driver_id = formData.get('driver_id') as string
    const amount = parseInt(formData.get('amount') as string)
    const note = formData.get('note') as string
    const date = formData.get('date') as string

    await supabase.from('advances').insert({
      driver_id,
      amount,
      note: note || null,
      date,
    })

    revalidatePath('/dashboard')
    revalidatePath(`/drivers/${driver_id}`)
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Add Advance</h1>
        </div>
      </div>

      <form action={createAdvance} className="p-4 space-y-4">
        <div>
          <label htmlFor="driver_id" className="block text-lg font-semibold text-gray-900 mb-2">
            Select Driver
          </label>
          <select
            id="driver_id"
            name="driver_id"
            required
            defaultValue={preselectedDriverId || ''}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          >
            <option value="">Choose a driver</option>
            {drivers?.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-lg font-semibold text-gray-900 mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            min="1"
            step="1"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-lg font-semibold text-gray-900 mb-2">
            Note (Optional)
          </label>
          <input
            type="text"
            id="note"
            name="note"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
            placeholder="e.g. Fuel, Emergency"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-lg font-semibold text-gray-900 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
          />
        </div>

        <div className="pt-4 space-y-2">
          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-4 rounded-lg text-lg font-semibold active:bg-amber-700"
          >
            Add Advance
          </button>
          <a
            href="/dashboard"
            className="block w-full bg-gray-200 text-gray-900 text-center py-4 rounded-lg text-lg font-semibold active:bg-gray-300"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
