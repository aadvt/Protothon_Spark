'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    let role = 'student'
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('user_role').eq('id', user.id).single()
        if (profile?.user_role) {
            role = profile.user_role
        }
    }

    revalidatePath('/', 'layout')
    redirect(`/dashboard?role=${role}`)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string
    const githubUsername = formData.get('githubUsername') as string || null
    const leetcodeUsername = formData.get('leetcodeUsername') as string || null

    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                user_role: role,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase.from('profiles').insert({
            id: authData.user.id,
            email: email,
            user_role: role,
            full_name: fullName,
        })

        if (profileError) {
            console.error('Failed to create profile', profileError)
            return { error: 'Auth successful but failed to create profile record. Please contact support.' }
        }

        // Initialize academics record for students
        if (role === 'student') {
            const { error: academicsError } = await supabase.from('academics').insert({
                student_id: authData.user.id,
                gpa: 0.0,
                graduation_year: new Date().getFullYear() + 4,
                github_username: githubUsername,
                leetcode_username: leetcodeUsername,
            })
            if (academicsError) {
                console.error('Failed to create academics', academicsError)
                return { error: 'Auth and profile successful but failed to initialize academics record.' }
            }
        }
    }

    // After signup, we might want to automatically create a profile record in your 'academics' or 'profiles' table
    // But for now, we'll just redirect to a confirmation or login page.
    // Note: Supabase might require email confirmation depending on settings.

    revalidatePath('/', 'layout')
    return { success: 'Signup successful! You can now log in.' }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
