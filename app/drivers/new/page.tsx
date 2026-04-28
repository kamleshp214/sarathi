import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default function NewDriverPage() {
  async function createDriver(formData: FormData) {
    'use server'
    
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const base_salary = parseInt(formData.get('base_salary') as string)
    const bhatta_rate = parseInt(formData.get('bhatta_rate') as string)
    const joining_date = formData.get('joining_date') as string

    await supabase.from('drivers').insert({
      name,
      phone,
      base_salary,
      bhatta_rate,
      joining_date,
    })

    revalidatePath('/dashboard')
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Add New Driver</h1>
        </div>
      </div>

      <form action={createDriver} className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg font-semibold text-gray-900 mb-2">
            Driver Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Enter driver name"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-lg font-semibold text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label htmlFor="base_salary" className="block text-lg font-semibold text-gray-900 mb-2">
            Base Salary (₹)
          </label>
          <input
            type="number"
            id="base_salary"
            name="base_salary"
            required
            min="0"
            step="100"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
            placeholder="e.g. 10000"
          />
        </div>

        <div>
          <label htmlFor="bhatta_rate" className="block text-lg font-semibold text-gray-900 mb-2">
            Bhatta Rate (₹ per day)
          </label>
          <input
            type="number"
            id="bhatta_rate"
            name="bhatta_rate"
            required
            min="0"
            defaultValue="300"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="joining_date" className="block text-lg font-semibold text-gray-900 mb-2">
            Joining Date
          </label>
          <input
            type="date"
            id="joining_date"
            name="joining_date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        <div className="pt-4 space-y-2">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold active:bg-green-700"
          >
            Add Driver
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
