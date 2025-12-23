'use client'

import * as Ably from 'ably'
import { AblyProvider, ChannelProvider, useChannel } from 'ably/react'
import { useState } from 'react'
import { FillingState, FormState, initialState } from '../patient-form-client'

export default function StaffFormClient() {
  const client = new Ably.Realtime({ authUrl: '/token', authMethod: 'POST' })

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="patient-form-updates">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">Staff Form</h1>

          <StaffForm />
        </div>
      </ChannelProvider>
    </AblyProvider>
  )
}

function StaffForm() {

  const [form, setEntries] = useState<FormState>(initialState)
  const [status, setStatus] = useState<FillingState>('pristine')

  const { channel } = useChannel('patient-form-updates', (message: Ably.Message) => {
    console.log(message);
    if (message.data.field) {
      const { name, value } = message.data.field;
      setEntries(prev => ({ ...prev, [name]: value }))
    }

    if (message.data.status) {
      setStatus(message.data.status)
    }
  });

  return (
    <>
      <p className="mb-4"><span className="font-bold">Patient form status:</span> {status}</p>
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">First name</label>
            <input name="firstName" value={form.firstName} className="mt-1 w-full border rounded px-2 py-1" disabled />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">Middle name</label>
            <input name="middleName" value={form.middleName} className="mt-1 w-full border rounded px-2 py-1" disabled />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">Last name</label>
            <input name="lastName" value={form.lastName} className="mt-1 w-full border rounded px-2 py-1" disabled />
          </div>

          <div>
            <label className="block text-sm font-medium">Date of birth</label>
            <input name="birthDate" value={form.birthDate} type="date" disabled className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select name="gender" value={form.gender} className="mt-1 w-full border rounded px-2 py-1" disabled>
              <option value="">Select gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Phone number</label>
            <input name="phone" value={form.phone} type="tel" className="mt-1 w-full border rounded px-2 py-1" disabled />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" value={form.email} type="email" className="mt-1 w-full border rounded px-2 py-1" disabled />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea name="address" value={form.address} rows={3} className="mt-1 w-full border rounded px-2 py-1" disabled />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Preferred language</label>
            <input name="language" value={form.language} className="mt-1 w-full border rounded px-2 py-1" disabled />
          </div>

          <div>
            <label className="block text-sm font-medium">Nationality</label>
            <input name="nationality" value={form.nationality} className="mt-1 w-full border rounded px-2 py-1" disabled />
          </div>

          <div>
            <label className="block text-sm font-medium">Religion</label>
            <input name="religion" value={form.religion} className="mt-1 w-full border rounded px-2 py-1" disabled />
          </div>
        </div>

        <fieldset className="border p-4 rounded">
          <legend className="text-sm font-medium">Emergency contact (optional)</legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium">Phone number</label>
              <input name="emergencyPhone" value={form.emergencyPhone} className="mt-1 w-full border rounded px-2 py-1" disabled />
            </div>

            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="emergencyName" value={form.emergencyName} className="mt-1 w-full border rounded px-2 py-1" disabled />
            </div>

            <div>
              <label className="block text-sm font-medium">Relationship</label>
              <input name="emergencyRelation" value={form.emergencyRelation} className="mt-1 w-full border rounded px-2 py-1" disabled />
            </div>
          </div>
        </fieldset>
      </form>
    </>
  )
}