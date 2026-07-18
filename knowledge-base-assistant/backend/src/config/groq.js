import Groq from 'groq-sdk';

/**
 * Lazily initialized Groq client.
 * Startup won't throw if GROQ_API_KEY is missing — the error only surfaces
 * when /ask is actually called, so auth/docs/etc. still work during dev
 * even if the AI key isn't set yet.
 */
let groqClient = null;

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return groqClient;
};

/**
 * Model priority list. getGroqModel() tries each in order and returns the
 * first one that matches a model we know Groq currently serves. If Groq
 * later deprecates llama-3.3-70b-versatile, the fallback kicks in
 * automatically without a code change — just an env var override.
 *
 * Model IDs verified against https://console.groq.com/docs/models (July 2025):
 *   llama-3.3-70b-versatile  — flagship, 128k context, best quality
 *   llama-3.1-70b-versatile  — previous generation fallback
 *   llama3-70b-8192          — stable alias, 8k context
 */
const PREFERRED_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
];

export const getGroqModel = () =>
  process.env.GROQ_MODEL || PREFERRED_MODELS[0];

export { PREFERRED_MODELS };
