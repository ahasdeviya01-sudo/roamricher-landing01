/**
 * Roam Richer — Backend API Server
 *
 * - Hides Gemini API keys server-side
 * - Rotates between 3 keys round-robin to avoid rate limits
 * - In production: also serves the built React frontend (dist/)
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// ─── API Key Rotation ────────────────────────────────────────────────────────
const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[];

if (API_KEYS.length === 0) {
  console.error('❌  No GEMINI_API_KEY_* found in .env — please check your .env file.');
  process.exit(1);
}

let keyIndex = 0;
function getNextKey(): string {
  const key = API_KEYS[keyIndex % API_KEYS.length];
  keyIndex++;
  return key;
}

console.log(`✅  Loaded ${API_KEYS.length} Gemini API key(s). Round-robin rotation enabled.`);

// ─── POST /api/generate ──────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const { destination, budget } = req.body;

  if (!destination || !budget) {
    return res.status(400).json({ error: 'Missing destination or budget.' });
  }

  const apiKey = getNextKey();
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a 3-day "Roam Richer" style itinerary for ${destination} with a ${budget} budget. 
      Focus on local, non-touristy spots, hidden gems, and authentic experiences. 
      Keep descriptions very punchy, short, and bullet-point style. Avoid spammy or overly enthusiastic tourist language. 
      Provide realistic estimated costs. For costs, provide ONLY the number and local currency code (e.g., 'LKR 500'). If an activity is free, output exactly 'Free' with no additional text or explanations (do not say 'donation encouraged' or 'shopping extra').`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: 'e.g., 09:00 AM or Morning' },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING, description: 'Short, punchy, 1-2 sentences max.' },
                        cost: { type: Type.STRING },
                      },
                      required: ['time', 'title', 'description', 'cost'],
                    },
                  },
                  dailyTotal: { type: Type.STRING },
                },
                required: ['day', 'theme', 'activities', 'dailyTotal'],
              },
            },
            coordinates: {
              type: Type.OBJECT,
              properties: {
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
              },
              required: ['lat', 'lng'],
            },
          },
          required: ['days', 'coordinates'],
        },
      },
    });

    let text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Gemini returned no content." });
    }

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(text);

    console.log(`✅  Route generated for "${destination}" [budget: ${budget}] using key #${((keyIndex - 1) % API_KEYS.length) + 1}`);
    return res.json(data);

  } catch (err: any) {
    console.error(`❌  Gemini error (key #${((keyIndex - 1) % API_KEYS.length) + 1}):`, err?.message ?? err);
    return res.status(500).json({ error: 'AI generation failed. Please try again.' });
  }
});

// ─── Serve Static Frontend (production) ─────────────────────────────────────
// In production (VM), build the frontend first: npm run build
// Then start only the backend: npm run server
// Both frontend + API are served from this single process.
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  const indexFile = path.join(distPath, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(404).send('Frontend not built. Run: npm run build');
    }
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3001', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  Roam Richer API server running at http://0.0.0.0:${PORT}`);
  console.log(`    /api/generate  → Gemini proxy with round-robin key rotation`);
  console.log(`    /*             → Serves built frontend from dist/`);
});
