import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

/**
 * Extracts plain text from a stored file based on its detected type.
 * Returns { text, status, error } so the caller can persist extraction
 * status on the Document even when extraction fails (graceful degradation —
 * the document still exists, it just can't be used for Q&A yet).
 */
export const extractText = async (filePath, fileType) => {
  try {
    let text = '';

    if (fileType === 'pdf') {
      const buffer = await fs.readFile(filePath);
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else if (fileType === 'txt' || fileType === 'md') {
      text = await fs.readFile(filePath, 'utf-8');
    } else {
      throw new Error(`Unsupported file type for extraction: ${fileType}`);
    }

    const trimmed = text.trim();

    if (!trimmed) {
      return {
        text: '',
        status: 'failed',
        error: 'No extractable text found in the document (it may be empty or a scanned image PDF)',
      };
    }

    return { text: trimmed, status: 'success', error: null };
  } catch (error) {
    return {
      text: '',
      status: 'failed',
      error: `Text extraction failed: ${error.message}`,
    };
  }
};

/**
 * Gemini's context window is large but not infinite, and stuffing an
 * entire huge document in raises cost/latency. We cap the context sent
 * per question — good enough for typical assessment-scale documents.
 */
export const truncateForContext = (text, maxChars = 20000) => {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[...document truncated for length...]`;
};
