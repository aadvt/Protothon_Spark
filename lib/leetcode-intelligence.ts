import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from './supabase'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export async function analyzeLeetCodeSkills(studentId: string, leetcodeUsername: string) {
    try {
        console.log(`Fetching live skill-stats for ${leetcodeUsername}...`)

        const query = `
            query userProblemsSolved($username: String!) {
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                        }
                    }
                    profile {
                        ranking
                    }
                    tagProblemCounts {
                        advanced {
                            tagName
                            tagSlug
                            problemsSolved
                        }
                        intermediate {
                            tagName
                            tagSlug
                            problemsSolved
                        }
                        fundamental {
                            tagName
                            tagSlug
                            problemsSolved
                        }
                    }
                }
            }
        `;

        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0'
            },
            body: JSON.stringify({
                query,
                variables: { username: leetcodeUsername }
            })
        });

        const data = await response.json();

        if (!data.data?.matchedUser) {
            throw new Error(`LeetCode user "${leetcodeUsername}" not found.`)
        }

        const user = data.data.matchedUser;
        const stats = user.submitStats.acSubmissionNum;
        const ranking = user.profile.ranking;
        const tags = user.tagProblemCounts;
        const totalSolved = stats.find((s: any) => s.difficulty === 'All')?.count || 0;

        // Structured skills with solved counts
        const skills: any = {};
        [...(tags.fundamental || []), ...(tags.intermediate || []), ...(tags.advanced || [])].forEach(tag => {
            // We'll store it as an object with solved count. 
            // Total counts are hard to get per tag in a single query, so we'll use dynamic scaling in UI.
            skills[tag.tagName] = {
                solved: tag.problemsSolved,
                slug: tag.tagSlug
            };
        });

        // Use AI to determine if this improves the DSA score
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        const prompt = `
            Analyze the following LeetCode skill distribution for user "${leetcodeUsername}" and provide a competitive DSA score (0-100).
            - Total Solved: ${totalSolved}
            - Ranking: ${ranking}
            - Topic Breakdown: ${JSON.stringify(skills)}
            
            Output strictly in this JSON format:
            { "dsa": number, "reasoning": "string" }
        `

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)

        if (!jsonMatch) throw new Error('AI failed to process skill data.')
        const scores = JSON.parse(jsonMatch[0])

        // Update Supabase
        const { error } = await supabase
            .from('academics')
            .update({
                dsa_skill: scores.dsa,
                leetcode_username: leetcodeUsername,
                skill_distribution: skills,
                last_analyzed_at: new Date().toISOString()
            })
            .eq('student_id', studentId)

        if (error) throw error

        return {
            success: true,
            score: scores.dsa,
            message: `Bubble-ready analysis complete for ${leetcodeUsername}.`
        }
    } catch (err: any) {
        console.error('LeetCode Skill Analysis Error:', err)
        return { success: false, error: err.message }
    }
}
