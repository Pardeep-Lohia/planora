const { GoogleGenerativeAI } = require('@google/generative-ai');
const asyncHandler = require('../../utils/asyncHandler');

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in environment');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Using a chat-capable model; adjust if needed.
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

async function generateText({ prompt, systemInstruction }) {
  const model = getModel();

  // Gemini JS supports content parts; keep it simple for beginner-friendly structure.
  const parts = [];
  if (systemInstruction) {
    parts.push({ text: systemInstruction });
  }
  parts.push({ text: prompt });

  const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
  const text = result.response.text();
  return text;
}

module.exports = { generateText };

