import { getGroqClient, getGroqModel, PREFERRED_MODELS } from '../config/groq.js';
import { truncateForContext } from './textExtractionService.js';


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
        temperature: 0.2,      
        max_tokens: 1024,
        stream: false,
      });

      const answer = completion.choices?.[0]?.message?.content?.trim();

      if (!answer) {
        throw new Error('Groq returned an empty response');
      }

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
        continue; 
      }

      throw error;
    }
  }

  throw lastError || new Error('No available Groq models could handle the request');
};
