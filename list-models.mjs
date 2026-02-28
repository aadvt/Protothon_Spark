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

async function listModels() {
    loadEnv();
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    // The SDK itself doesn't have a direct listModels, but we can try common names
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-2.0-flash'];

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("test");
            console.log(`Model ${modelName} works!`);
        } catch (e) {
            console.log(`Model ${modelName} failed: ${e.message}`);
        }
    }
}

listModels();
