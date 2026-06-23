require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY is not defined in your backend/.env file.");
  process.exit(1);
}

console.log("🔍 Diagnosing Gemini API Connection...");
console.log(`🔑 API Key starts with: "${apiKey.substring(0, 6)}..." (Total length: ${apiKey.length})`);

if (!apiKey.startsWith("AIzaSy")) {
  console.warn("⚠️ WARNING: Typically, Google AI Studio Gemini API keys start with 'AIzaSy'.");
  console.warn("   Your key starts with different characters. Ensure it is a valid Google AI Studio key.");
  console.warn("   If you are using Google Cloud Vertex AI, you need a different SDK or setup.");
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    console.log(`\n🤖 Testing model: "${modelName}"...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello, respond with the word 'Success' only.");
    const text = result.response.text();
    console.log(`✅ Success! Response: "${text.trim()}"`);
    return true;
  } catch (error) {
    console.error(`❌ Failed for "${modelName}":`, error.message);
    return false;
  }
}

async function listModelsDirectly() {
  try {
    console.log("\nFetching available models list via HTTP endpoint...");
    const https = require('https');
    
    return new Promise((resolve) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode === 200 && parsed.models) {
              console.log("📋 Available Models for your key:");
              parsed.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                  console.log(`  - ${m.name.replace("models/", "")}`);
                }
              });
            } else {
              console.error("❌ Failed to list models. Status:", res.statusCode, parsed.error || parsed);
            }
          } catch (e) {
            console.error("❌ Failed to parse response data:", e.message);
          }
          resolve();
        });
      }).on('error', (err) => {
        console.error("❌ Request error:", err.message);
        resolve();
      });
    });
  } catch (err) {
    console.error("❌ Error performing HTTP listModels check:", err.message);
  }
}

async function run() {
  // Test gemini-1.5-flash
  const flashOk = await testModel("gemini-1.5-flash");
  
  if (!flashOk) {
    // If flash fails, try gemini-1.5-pro or gemini-2.0-flash
    await testModel("gemini-1.5-pro");
    await testModel("gemini-2.0-flash");
    
    // Also run list check
    await listModelsDirectly();
  } else {
    console.log("\n🎉 Gemini API is working properly with gemini-1.5-flash!");
  }
}

run();
