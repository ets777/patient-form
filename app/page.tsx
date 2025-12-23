
import React from 'react';
import './global.css';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar.tsx';

const PatientFormClient = dynamic(() => import('./patient-form-client.tsx'), {
  ssr: false,
})

const PatientFormPage = () => {

  const pageId = 'PatientForm'

  return (
    <>
      <Sidebar pageId={pageId} />
      <div className="flex flex-col grow gap-6 p-4 lg:p-12 rounded-2xl border-slate-100 border-t border-b border-l border-r border-solid border bg-slate-50">
        <PatientFormClient />
      </div>
    </>
  )
}

export default PatientFormPage;
