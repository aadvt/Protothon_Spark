import { Octokit } from '@octokit/rest'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from './supabase'

const octokit = new Octokit({
    auth: process.env.GITHUB_PAT
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export async function analyzeGitHubSkills(studentId: string, githubUsername: string) {
    try {
        console.log(`Analyzing GitHub intelligence for ${githubUsername}...`)

        // 1. Fetch repositories
        const { data: repos } = await octokit.repos.listForUser({
            username: githubUsername,
            sort: 'updated',
            per_page: 100
        })

        if (!repos || repos.length === 0) {
            throw new Error('No public repositories found for this user.')
        }

        // 2. Aggregate languages and collect metadata
        const languages: Record<string, number> = {}
        const repoMetadata: any[] = []

        for (const repo of repos) {
            repoMetadata.push({
                name: repo.name,
                description: repo.description,
                language: repo.language,
                topics: repo.topics
            })

            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1
            }
        }

        // 3. Prepare AI Prompt for scoring and framework detection
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        const prompt = `
            Analyze the following GitHub repositories for "${githubUsername}". 
            Repositories: ${JSON.stringify(repoMetadata, null, 2)}
            
            Based on the repository names, descriptions, and topics, perform two tasks:
            1. Provide skill scores (0-100) for "frontend", "backend", and "dsa".
            2. Identify the top 5 "frameworks" or libraries used (e.g., React, Next.js, Django, PyTorch, Node.js).
            
            Output strictly in this JSON format:
            {
                "frontend": number,
                "backend": number,
                "dsa": number,
                "frameworks": string[],
                "reasoning": "string"
            }
        `

        // 4. Generate AI Assessment
        const result = await model.generateContent(prompt)
        const responseText = result.response.text()
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)

        if (!jsonMatch) throw new Error('AI failed to parse technical stack.')
        const analysis = JSON.parse(jsonMatch[0])

        // 5. Update Supabase with comprehensive stats
        const githubStats = {
            languages,
            frameworks: analysis.frameworks,
            top_repos: repoMetadata.slice(0, 5).map(r => r.name)
        }

        const { error } = await supabase
            .from('academics')
            .update({
                frontend_skill: analysis.frontend,
                backend_skill: analysis.backend,
                dsa_skill: analysis.dsa,
                github_username: githubUsername,
                github_stats: githubStats,
                last_analyzed_at: new Date().toISOString()
            })
            .eq('student_id', studentId)

        if (error) throw error

        return {
            success: true,
            analysis,
            stats: githubStats,
            message: `GitHub Intelligence updated for ${githubUsername}.`
        }
    } catch (err: any) {
        console.error('GitHub Analysis Error:', err)
        return { success: false, error: err.message }
    }
}
