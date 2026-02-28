import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    const newJobs = [
        {
            title: 'Google Software Engineer',
            company: 'Google',
            location: 'Bangalore, India',
            salary_range: '30 LPA - 45 LPA',
            description: 'Looking for strong DSA and core CS fundamentals. Specifically targeting students with 85%+ in DSA and high problem-solving skills.',
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
        },
        {
            title: 'AI Researcher',
            company: 'OpenAI',
            location: 'San Francisco, CA',
            salary_range: '40 LPA - 60 LPA',
            description: 'Pushing the boundaries of artificial intelligence. Strong math and ML algorithms background expected.',
            required_skills: { ai: 95, backend: 80, dsa: 90 },
            is_active: true
        }
    ]
    const { data, error } = await supabase.from('jobs').insert(newJobs).select()
    console.log('Seeded jobs:', data)
    if (error) console.error('Error seeding:', error)
}

seed()
