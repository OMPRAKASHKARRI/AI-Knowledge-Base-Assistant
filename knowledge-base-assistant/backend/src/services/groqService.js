import { getGroqClient, getGroqModel, PREFERRED_MODELS } from '../config/groq.js';
import { truncateForContext } from './textExtractionService.js';

/**
 * Answers a question using the document's extracted text as grounding context.
 *
 * Uses the OpenAI-compatible Groq SDK, which accepts a standard
 * `chat.completions.create()` call — so swapping models is just an env var.
 *
 * Automatic model fallback:
 *   If the primary model returns a 404 (model not found / deprecated),
 *   we retry once with each fallback in PREFERRED_MODELS before giving up.
 *   This means the app keeps working even if Groq rotates model IDs.
 *
 * Throws on failure — the controller (chatController.js) catches this and
 * persists the failed attempt to conversation history before returning 502.
 */
export const answerQuestionFromDocument = async (documentText, question) => {
  const client = getGroqClient();
  const context = truncateForContext(documentText);

  const messages = [
    {
      role: 'system',
      content:
        'You are a precise assistant that answers questions exclusively from the document provided by the user. ' +
        'If the answer is not present in the document, say clearly: ' +
        '"The information you requested is not available in the uploaded document." ' +
        'Never speculate or use outside knowledge.',
    },
    {
      role: 'user',
      content: `Document content:\n"""\n${context}\n"""\n\nQuestion: ${question}`,
    },
  ];

  // Try preferred model first, then fall back through the list if Groq
  // returns a model-not-found error (status 404).
  const modelsToTry = [
    getGroqModel(),
    ...PREFERRED_MODELS.filter((m) => m !== getGroqModel()),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.2,      // low temperature = factual, document-grounded answers
        max_tokens: 1024,
        stream: false,
      });

      const answer = completion.choices?.[0]?.message?.content?.trim();

      if (!answer) {
        throw new Error('Groq returned an empty response');
      }

      // Log which model actually served the request (helpful for debugging)
      if (model !== getGroqModel()) {
        console.warn(`[groqService] Primary model unavailable — used fallback: ${model}`);
      }

      return answer;
    } catch (error) {
      const isModelNotFound =
        error?.status === 404 ||
        error?.message?.toLowerCase().includes('model not found') ||
        error?.message?.toLowerCase().includes('does not exist');

      if (isModelNotFound) {
        console.warn(`[groqService] Model "${model}" not found, trying next fallback…`);
        lastError = error;
        continue; // try the next model in the list
      }

      // Any other error (auth, rate limit, network) — fail fast, don't retry
      throw error;
    }
  }

  // All models exhausted
  throw lastError || new Error('No available Groq models could handle the request');
};
