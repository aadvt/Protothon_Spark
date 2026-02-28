import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions
export type Profile = {
  id: string
  email: string
  user_role: 'student' | 'recruiter' | 'admin'
  full_name: string
  phone?: string
  company?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type Academic = {
  id: string
  student_id: string
  gpa: number
  graduation_year: number
  verification_status: 'verified' | 'pending' | 'rejected'
  frontend_skill: number
  backend_skill: number
  dsa_skill: number
  github_username?: string
  last_analyzed_at?: string
  manual_override: boolean
  created_at: string
  updated_at: string
}

export type Job = {
  id: string
  recruiter_id: string
  title: string
  company: string
  description?: string
  required_skills: {
    frontend: number
    backend: number
    dsa: number
  }
  min_cgpa: number
  min_experience: number
  salary_range?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Interview = {
  id: string
  student_id: string
  recruiter_id: string
  job_id: string
  scheduled_at?: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export type PlacementAudit = {
  id: string
  admin_id: string
  action: string
  target_type?: string
  target_id?: string
  metadata?: Record<string, any>
  created_at: string
}
