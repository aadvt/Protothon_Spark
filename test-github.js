const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const { GoogleGenerativeAI } = require('@google/generative-ai');

function loadEnv() {
    try {
        const envContent = fs.readFileSync('.env', 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                process.env[key] = value.trim();
            }
        }
    } catch (e) {
        console.error('Error loading .env', e.message);
    }
}

async function testGithub() {
    loadEnv();

    if (!process.env.GITHUB_PAT) {
        console.error('GITHUB_PAT not found in .env');
        return;
    }

    const octokit = new Octokit({
        auth: process.env.GITHUB_PAT
    });

    const githubUsername = 'octocat';

    try {
        console.log(`Checking repos for ${githubUsername}...`);
        const { data: repos } = await octokit.repos.listForUser({
            username: githubUsername,
            sort: 'updated',
            per_page: 5
        });

        console.log(`Found ${repos.length} repos.`);
        if (repos.length > 0) {
            console.log(`Example repo: ${repos[0].name}`);
        }

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('GOOGLE_GENERATIVE_AI_API_KEY not found in .env');
            return;
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
        // Using "gemini-1.5-flash" here for testing
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        console.log(`Testing Gemini connection...`);
        const result = await model.generateContent("Hello! Can you help analyze a GitHub profile?");
        console.log(`Gemini response: ${result.response.text().substring(0, 50)}...`);

        console.log('--- TEST SUCCESSFUL ---');
    } catch (error) {
        console.error('--- TEST FAILED ---');
        console.error(error.message);
    }
}

testGithub();
