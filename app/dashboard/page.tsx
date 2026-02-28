'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import StudentDashboard from './student/page'
import RecruiterDashboard from './recruiter/page'
import AdminDashboard from './admin/page'

export default function DashboardRouter() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'student'

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {role === 'recruiter' && <RecruiterDashboard />}
      {role === 'admin' && <AdminDashboard />}
      {role === 'student' && <StudentDashboard />}
    </Suspense>
  )
}
