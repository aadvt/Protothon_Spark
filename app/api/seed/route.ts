import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
    const newJobs = [
        {
            title: 'Google Software Engineer',
            company: 'Google',
            location: 'Bangalore, India',
            salary_range: '30 LPA - 45 LPA',
            description: 'Looking for strong DSA and core CS fundamentals. Targeting students with 85%+ in DSA and high problem-solving skills.',
            required_skills: { dsa: 85, frontend: 60, backend: 70 },
            is_active: true
        },
        {
            title: 'Frontend Developer',
            company: 'Vercel',
            location: 'Remote',
            salary_range: '25 LPA - 35 LPA',
            description: 'Join the team building the future of the web. TypeScript and React expertise is a must.',
            required_skills: { frontend: 90, backend: 40, dsa: 60 },
            is_active: true
        },
        {
            title: 'Backend Engineer',
            company: 'Stripe',
            location: 'Remote',
            salary_range: '35 LPA - 50 LPA',
            description: 'Scale our payment infrastructure. Deep knowledge of backend architectures and databases required.',
            required_skills: { backend: 90, dsa: 80, frontend: 30 },
            is_active: true
        }
    ]
    const { data, error } = await supabase.from('jobs').insert(newJobs).select()
    return NextResponse.json({ data, error })
}
