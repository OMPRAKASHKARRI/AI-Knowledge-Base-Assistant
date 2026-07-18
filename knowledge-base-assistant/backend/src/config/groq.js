import Groq from 'groq-sdk';

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

const PREFERRED_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
];

export const getGroqModel = () =>
  process.env.GROQ_MODEL || PREFERRED_MODELS[0];

export { PREFERRED_MODELS };
