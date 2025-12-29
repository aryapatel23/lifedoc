const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

/* const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}); */

const auth = require('../middleware/authMiddleware');
const Consultation = require('../models/Consultation');
const Prescription = require('../models/Prescription');

// Middleware to check auth would go here
// const auth = require('../middleware/auth'); 

// POST /api/ai/analyze
// Desc: Analyze symptom text and return medical summary
router.post('/analyze', auth, async (req, res) => {
    const { text, language } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        console.error("Server Error: OPENAI_API_KEY is missing from environment variables.");
        return res.status(500).json({ msg: 'Server Configuration Error: API Key missing.' });
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    if (!text) {
        return res.status(400).json({ msg: 'Please provide symptom text' });
    }

    try {
        const prompt = `
    You are Docmetry, an AI medical assistant for elderly patients. 
    Analyze the following patient statement: "${text}"
    
    Provide the response in JSON format with these fields:
    - summary: A conversational, empathetic summary of what the patient said, addressed TO the patient (e.g., "I understand you are feeling...").
    - urgency: "Low", "Medium", or "High".
    - actions: A list of 2-3 simple, actionable steps they can take at home or should do next.
    - language: Detect the language or use the provided preference (${language || 'English'}). Ensure the summary and actions are in this language.
    
    IMPORTANT: Provide strictly valid JSON. Do not include markdown formatting.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a helpful and empathetic medical AI assistant." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const aiResult = JSON.parse(response.choices[0].message.content);

        // Save to Database
        const newConsultation = new Consultation({
            user: req.user.id,
            symptoms: text,
            aiSummary: aiResult.summary,
            urgency: aiResult.urgency,
            actions: aiResult.actions,
            language: language || 'en'
        });

        await newConsultation.save();

        res.json(aiResult);
    } catch (err) {
        console.error("AI Error:", err.message);
        res.status(500).json({ msg: 'Error processing AI request', error: err.message });
    }
});

// POST /api/ai/analyze-prescription
// Desc: Analyze prescription image using Vision model
router.post('/analyze-prescription', auth, async (req, res) => {
    const { image } = req.body; // Base64 image string

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ msg: 'Server Configuration Error: API Key missing.' });
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    if (!image) {
        return res.status(400).json({ msg: 'Please upload an image' });
    }

    try {
        const prompt = `
    You are an expert pharmacist and doctor assistant.
    Analyze this prescription image. 
    
    Extract the following details in strict JSON format:
    - medicines: array of objects { name, dosage, timing (e.g., "Morning-Night"), precaution (e.g., "After food") }
    - audioSummary: A simple, clear paragraph explaining to the patient how to take their medicines in plain language (e.g., "You have 3 medicines. Take the Paracetamol after lunch...").
    
    If you cannot read the prescription or if it's not a prescription, return an error message in the summary.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: image } }
                    ]
                }
            ],
            max_tokens: 1000,
            response_format: { type: "json_object" },
        });

        const aiResult = JSON.parse(response.choices[0].message.content);

        // Save to Database
        const newPrescription = new Prescription({
            user: req.user.id,
            image: image, // Note: Storing Base64 in Mongo is not ideal for prod, but OK for this demo
            medicines: aiResult.medicines,
            audioSummary: aiResult.audioSummary
        });

        await newPrescription.save();

        res.json(aiResult);

    } catch (err) {
        console.error("Vision AI Error:", err.message);
        res.status(500).json({ msg: 'Error analyzing image', error: err.message });
    }
});

// POST /api/ai/summerizer
// Desc: Summarize diary entry using Gemini
router.post('/summerizer', auth, async (req, res) => {
    try {
        const { prompt } = req.query; // e.g. "diarySummerizer"
        const { text, date } = req.body;

        if (!prompt) {
            return res.status(400).json({ msg: 'Prompt query parameter is required' });
        }

        // Validate prompt file exists
        const promptPath = path.join(__dirname, `../prompts/${prompt}.txt`);
        if (!fs.existsSync(promptPath)) {
            return res.status(404).json({ msg: 'Prompt file not found' });
        }

        const basePrompt = fs.readFileSync(promptPath, 'utf8');

        if (!process.env.GEMINI_API_KEY) {
            console.error("Server Error: GEMINI_API_KEY is missing.");
            return res.status(500).json({ msg: 'Server Configuration Error: API Key missing.' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-flash-latest which was verified to work
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const fullPrompt = `${basePrompt}\n\nUser Diary Entry (${date || 'Today'}):\n${text}\n\nOutput JSON:`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig: { responseMimeType: "application/json" } // Force JSON
        });

        const response = await result.response;
        const textResponse = response.text();

        // Parse JSON safely
        let aiResult;
        try {
            aiResult = JSON.parse(textResponse);
        } catch (e) {
            // Fallback cleanup if not pure JSON
            const cleanText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            aiResult = JSON.parse(cleanText);
        }

        res.json(aiResult);

    } catch (err) {
        console.error("Gemini AI Error:", err.message);
        res.status(500).json({ msg: 'Error processing AI request', error: err.message });
    }
});

module.exports = router;
