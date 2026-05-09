const { db } = require('../../firebase/admin');
const { ApiError } = require('../../utils/apiError');
const aiService = require('./aiService');

const SYSTEM = `You are Planora, an AI productivity coach.
Return ONLY valid JSON.
No markdown.
Schema:
{
  "timeline": [
    { "time": "HH:MM", "task": "string", "focus": "string", "tone": "primary|success|warning" }
  ],
  "priorities": ["High|Medium|Low"],
  "focusSuggestions": ["string"],
  "estimatedProductivity": number,
  "habitsImprovements": ["string"],
  "reschedule": [{ "task": "string", "suggestedTime": "HH:MM" }]
}`;

function buildTimelineFromGoals({ goals }) {
  const base = goals
    .split(/\n|,|\./)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!base.length) {
    return ['Focus on the right tasks', 'Protect energy', 'Finish one win'];
  }
  return base;
}

function normalizeJSON(text) {
  // Model might return extra whitespace; try to extract JSON substring.
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1) return null;
  return JSON.parse(text.slice(first, last + 1));
}

async function generateDailyPlan({ userId, goals, timezone }) {
  const timelineSeed = buildTimelineFromGoals({ goals });

  const prompt = `User goals (raw): ${goals}\n\nTimezone: ${timezone || 'local'}\n\nCreate a realistic day schedule using the goals.
- Provide 6 focus blocks.
- Each block must contain time in HH:MM (24h), and a short focus label.
- estimatedProductivity must be a number from 0 to 100.
- Also return habitsImprovements and reschedule suggestions for unfinished tasks.
Use this seed ideas: ${timelineSeed.join(' | ')}.`;

  const aiText = await aiService.generateText({ prompt, systemInstruction: SYSTEM });

  let json = null;
  try {
    json = normalizeJSON(aiText);
  } catch (e) {
    throw new ApiError(502, 'Gemini returned invalid JSON');
  }

  if (!json || !Array.isArray(json.timeline)) {
    throw new ApiError(502, 'Gemini plan missing timeline');
  }

  // Store last plan for the user (optional, keeps future AI context).
  try {
    await db.collection('ai_memory').add({
      userId,
      type: 'planner',
      payload: json,
      createdAt: new Date()
    });
  } catch (e) {
    // Non-fatal.
  }

  return json;
}

module.exports = { generateDailyPlan };

