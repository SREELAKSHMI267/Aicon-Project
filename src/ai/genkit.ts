
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI calls will fail until the key is configured.');
}

export const ai = genkit({
  plugins: GEMINI_API_KEY ? [googleAI({ apiKey: GEMINI_API_KEY })] : [],
  model: 'googleai/gemini-2.5-flash',
});

export function ensureAiKey() {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable not set. Add it to .env.local and restart dev server.');
  }
}
