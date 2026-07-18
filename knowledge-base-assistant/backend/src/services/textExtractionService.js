import fs from 'fs/promises';
import pdfParse from 'pdf-parse';


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


export const truncateForContext = (text, maxChars = 20000) => {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}\n\n[...document truncated for length...]`;
};
