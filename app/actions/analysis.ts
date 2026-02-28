'use server'

import { analyzeGitHubSkills } from '@/lib/github-intelligence'
import { analyzeLeetCodeSkills } from '@/lib/leetcode-intelligence'
import { revalidatePath } from 'next/cache'

export async function triggerGitHubAnalysis(studentId: string, githubUsername: string) {
    if (!githubUsername) {
        return { success: false, error: 'GitHub username is required' }
    }

    const result = await analyzeGitHubSkills(studentId, githubUsername)

    if (result.success) {
        revalidatePath('/dashboard')
    }

    return result
}

export async function triggerLeetCodeAnalysis(studentId: string, leetcodeUsername: string) {
    if (!leetcodeUsername) {
        return { success: false, error: 'LeetCode username is required' }
    }

    const result = await analyzeLeetCodeSkills(studentId, leetcodeUsername)

    if (result.success) {
        revalidatePath('/dashboard')
    }

    return result
}
