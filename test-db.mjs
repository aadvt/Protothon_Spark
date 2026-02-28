import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl)
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing env variables')
        return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase.from('profiles').select('*').limit(1)

    if (error) {
        console.error('Connection Error:', error.message)
        console.error('Details:', error)
    } else {
        console.log('Connection Successful! Profiles count:', data.length)
    }
}

testConnection()
