const { GoogleGenAI } = require("@google/genai");

console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);
console.log("Gemini key starts with:", process.env.GEMINI_API_KEY?.slice(0, 6));

function extractJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Gemini returned empty or non-text response");
  }

  let clean = text.trim();

  // Remove markdown fences if present
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\s*/i, "");
  }
  if (clean.endsWith("```")) {
    clean = clean.replace(/```$/i, "");
  }

  clean = clean.trim();

  // Try direct parse first
  try {
    return JSON.parse(clean);
  } catch (_) {}

  // Fallback: try to extract the first JSON object or array
  const objectMatch = clean.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return JSON.parse(objectMatch[0]);
  }

  const arrayMatch = clean.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return JSON.parse(arrayMatch[0]);
  }

  throw new Error(`Could not parse JSON from Gemini response: ${clean}`);
}

async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not configured");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    return extractJson(text);
  } catch (error) {
    console.error("Gemini first attempt failed:");
    console.error(error);

    try {
      const retryPrompt = `${prompt}

IMPORTANT:
- Return ONLY valid JSON
- Do not add markdown
- Do not add explanation text outside JSON`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: retryPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      return extractJson(text);
    } catch (retryError) {
      console.error("Gemini retry failed:");
      console.error(retryError);
      throw new Error(`AI generation failed: ${retryError.message}`);
    }
  }
}

/**
 * Service 1: analyzeContext
 */
async function analyzeContext(title, description) {
  const prompt = `You are a decision analysis AI. Analyze this decision and respond ONLY in raw JSON.

Decision Title: ${title}
Description: ${description}

Return this exact structure:
{
  "category": "short_category_slug",
  "generatedCriteria": ["criterion1", "criterion2", "criterion3", "criterion4", "criterion5"],
  "selectedPersonas": ["Rational Analyst", "Budget Guardian", "Long-Term Planner"]
}

Rules:
- Pick 4 to 6 criteria most relevant to this specific decision type.
- Pick 3 to 4 personas most relevant from:
  Rational Analyst, Budget Guardian, Privacy Guardian, Long-Term Planner, Risk Manager, Emotional Check.`;

  return await callGemini(prompt);
}

/**
 * Service 2: runPersonaDebate
 */
async function runPersonaDebate(title, description, options, criteria, personas) {
  const debatePromises = personas.map(async (persona) => {
    const prompt = `You are ${persona}. Evaluate the following options for this decision.

Decision: ${title}
Context: ${description}
Options: ${options.join(", ")}
Criteria to evaluate against: ${criteria.join(", ")}

Rules:
- Evaluate each option against ALL criteria.
- Scores must be integers from 1 to 10.
- Option names and criterion names must match EXACTLY as provided.

Respond ONLY in raw JSON:
{
  "persona": "${persona}",
  "evaluations": [
    {
      "option": "option name",
      "scores": [
        { "criterion": "criterion name", "score": 7 }
      ],
      "summary": "one sentence summary from this persona's perspective",
      "concerns": "one sentence concern or risk"
    }
  ]
}`;

    try {
      return await callGemini(prompt);
    } catch (err) {
      console.error(`Error in debate call for persona: ${persona}`, err);

      return {
        persona,
        evaluations: options.map((opt) => ({
          option: opt,
          scores: criteria.map((crit) => ({ criterion: crit, score: 5 })),
          summary: `Unable to fully simulate ${persona}'s analysis. Provided a default score.`,
          concerns: "Could not retrieve concerns.",
        })),
      };
    }
  });

  return await Promise.all(debatePromises);
}

/**
 * Service 3: generateRecommendation
 */
async function generateRecommendation(title, options, criteria, personaDebate) {
  const optionScoresMap = {};
  options.forEach((opt) => {
    optionScoresMap[opt] = { sum: 0, count: 0 };
  });

  personaDebate.forEach((debateItem) => {
    if (!debateItem || !debateItem.evaluations) return;

    debateItem.evaluations.forEach((evalItem) => {
      const matchedOption =
        options.find((o) => o.toLowerCase() === evalItem.option.toLowerCase()) ||
        evalItem.option;

      if (!optionScoresMap[matchedOption]) return;

      evalItem.scores.forEach((s) => {
        optionScoresMap[matchedOption].sum += Number(s.score);
        optionScoresMap[matchedOption].count += 1;
      });
    });
  });

  const scores = options.map((opt) => {
    const stats = optionScoresMap[opt];
    const total =
      stats.count > 0 ? Number((stats.sum / stats.count).toFixed(2)) : 0;
    return { option: opt, total };
  });

  let bestOption = options[0];
  let maxScore = -1;

  scores.forEach((s) => {
    if (s.total > maxScore) {
      maxScore = s.total;
      bestOption = s.option;
    }
  });

  const prompt = `Given this decision analysis data, write a recommendation.

Decision: ${title}
Options evaluated: ${options.join(", ")}
Criteria: ${criteria.join(", ")}
Scores: ${JSON.stringify(scores)}
Determined Best Option (highest average score): ${bestOption}

Respond ONLY in raw JSON:
{
  "bestOption": "${bestOption}",
  "reason": "2-3 sentence explanation of why this option won",
  "tradeoff": "1-2 sentence honest tradeoff or caveat"
}`;

  const recommendation = await callGemini(prompt);

  return {
    bestOption: recommendation.bestOption || bestOption,
    reason: recommendation.reason || "Decided based on highest criteria scores.",
    tradeoff: recommendation.tradeoff || "No major tradeoffs identified.",
    scores,
  };
}

module.exports = {
  analyzeContext,
  runPersonaDebate,
  generateRecommendation,
};