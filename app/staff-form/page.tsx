'use client'

import Sidebar from '../../components/Sidebar';
import dynamic from 'next/dynamic';

const StaffFormClient = dynamic(() => import('./staff-form-client.tsx'), {
  ssr: false,
})

export default function StaffForm() {
  const pageId = 'StaffForm';

  return (
    <>
      <Sidebar pageId={pageId} />
      <div className="flex flex-col grow gap-6 p-4 lg:p-12 rounded-2xl border-slate-100 border-t border-b border-l border-r border-solid border bg-slate-50">
        <StaffFormClient />
      </div>
    </>
  )
}
