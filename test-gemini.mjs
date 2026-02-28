import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

async function testGemini() {
    loadEnv();
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    // Testing the most likely correct model names
    const modelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];

    for (const modelName of modelNames) {
        console.log(`Trying model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'Gemini works!'");
            console.log(`Success with ${modelName}: ${result.response.text()}`);
            break;
        } catch (e) {
            console.log(`Failed with ${modelName}: ${e.message}`);
        }
    }
}

testGemini();
