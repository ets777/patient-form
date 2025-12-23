'use client'

import * as Ably from 'ably';
import { useRef, useState } from 'react'
import { AblyProvider, ChannelProvider, useChannel } from 'ably/react';

const INACTIVE_DELAY = 5000;

export type FormState = {
  firstName: string
  middleName: string
  lastName: string
  birthDate: string
  gender: string
  phone: string
  email: string
  address: string
  language: string
  nationality: string
  emergencyPhone: string
  emergencyName: string
  emergencyRelation: string
  religion: string
}

type ErrorState = Partial<Record<keyof FormState, string>>
export type FillingState = ('submitted' | 'filling' | 'inactive' | 'pristine')

export const initialState: FormState = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  language: '',
  nationality: '',
  emergencyPhone: '',
  emergencyName: '',
  emergencyRelation: '',
  religion: '',
}

export default function PatientFormClient() {

  const client = new Ably.Realtime({ authUrl: '/token', authMethod: 'POST' });

  console.log(client, 'patient-form')

  return (
    <>
      <AblyProvider client={client}>
        <ChannelProvider channelName="patient-form-updates">
          <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Patient Form</h1>

            <PatientForm />
          </div>
        </ChannelProvider>
      </AblyProvider >
    </>
  )
}

function PatientForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<ErrorState>({})
  const [success, setSuccess] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { channel } = useChannel('patient-form-updates', (message: Ably.Message) => {
    console.log(message)
  });

  const publicFromClientHandler = (
    status: FillingState,
    field?: { name: string, value: string },
  ) => {
    if (channel === null) {
      return
    }

    channel.publish('patient-form-client', { status, field })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      publicFromClientHandler('inactive')
    }, INACTIVE_DELAY);

    publicFromClientHandler('filling', { name, value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess(null)

    if (!validate()) {
      return
    }

    publicFromClientHandler('submitted')
    setSuccess('Patient information submitted successfully')
    setForm(initialState)
  }

  function validate() {
    const err: Partial<ErrorState> = {}

    if (!form.firstName.trim()) {
      err.firstName = 'First name is required'
    }
    if (!form.lastName.trim()) {
      err.lastName = 'Last name is required'
    }
    if (!form.gender) {
      err.gender = 'Gender is required'
    }

    // phone validation
    const phoneClean = form.phone.replace(/[^0-9+]/g, '')
    if (!phoneClean || phoneClean.length < 7) {
      err.phone = 'Please enter a valid phone number'
    }

    // email validation
    if (!form.email) {
      err.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = 'Email is invalid'
    }

    // date of birth validation
    if (!form.birthDate) {
      err.birthDate = 'Date of birth is required'
    } else {
      const d = new Date(form.birthDate)
      const today = new Date()
      if (d > today) {
        err.birthDate = 'Date of birth cannot be in the future'
      }
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium">First name <span className="text-red-600">*</span></label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div className="sm:col-span-1">
          <label className="block text-sm font-medium">Middle name</label>
          <input name="middleName" value={form.middleName} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" />
        </div>

        <div className="sm:col-span-1">
          <label className="block text-sm font-medium">Last name <span className="text-red-600">*</span></label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Date of birth <span className="text-red-600">*</span></label>
          <input name="birthDate" value={form.birthDate} onChange={handleChange} type="date" className="mt-1 w-full border rounded px-2 py-1" required />
          {errors.birthDate && <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Gender <span className="text-red-600">*</span></label>
          <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required>
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
            <option value="prefer_not_say">Prefer not to say</option>
          </select>
          {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Phone number <span className="text-red-600">*</span></label>
          <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="mt-1 w-full border rounded px-2 py-1" required />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Email <span className="text-red-600">*</span></label>
        <input name="email" value={form.email} onChange={handleChange} type="email" className="mt-1 w-full border rounded px-2 py-1" required />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Address <span className="text-red-600">*</span></label>
        <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="mt-1 w-full border rounded px-2 py-1" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Preferred language <span className="text-red-600">*</span></label>
          <input name="language" value={form.language} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Nationality <span className="text-red-600">*</span></label>
          <input name="nationality" value={form.nationality} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium">Religion</label>
          <input name="religion" value={form.religion} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" />
        </div>
      </div>

      <fieldset className="border p-4 rounded">
        <legend className="text-sm font-medium">Emergency contact</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium">Phone number <span className="text-red-600">*</span></label>
            <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="emergencyName" value={form.emergencyName} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" />
          </div>

          <div>
            <label className="block text-sm font-medium">Relationship</label>
            <input name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} className="mt-1 w-full border rounded px-2 py-1" />
          </div>
        </div>
      </fieldset>

      <div className="pt-4">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      </div>

      {success && <p className="text-green-600 mt-4">{success}</p>}
    </form>
  )
}