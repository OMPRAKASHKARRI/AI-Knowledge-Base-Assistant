import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import * as documentService from '../../services/documentService';
import { getErrorMessage } from '../../services/api';
import Loader from '../common/Loader';
import ErrorState from '../common/ErrorState';

interface DocumentPreviewModalProps {
  documentId: string;
  onClose: () => void;
}

const DocumentPreviewModal = ({ documentId, onClose }: DocumentPreviewModalProps) => {
  const [preview, setPreview] = useState<{ name: string; fileType: string; preview: string; truncated: boolean } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    documentService
      .previewDocument(documentId)
      .then(({ data }) => isMounted && setPreview(data.data))
      .catch((err) => isMounted && setError(getErrorMessage(err)))
      .finally(() => isMounted && setIsLoading(false));
    return () => {
      isMounted = false;
    };
  }, [documentId]);

  return (
    <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-2xl max-h-[80vh] flex flex-col bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-200">
          <h2 className="font-display font-semibold text-lg text-ink-900 truncate">
            {preview?.name || 'Document preview'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-400 hover:text-ink-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading && <Loader label="Loading preview…" />}
          {!isLoading && error && <ErrorState message={error} />}
          {!isLoading && !error && preview && (
            <>
              {preview.fileType === 'md' ? (
                <div className="prose prose-sm max-w-none text-ink-800">
                  <ReactMarkdown>{preview.preview}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-ink-700 whitespace-pre-wrap leading-relaxed">{preview.preview}</p>
              )}
              {preview.truncated && (
                <p className="text-xs text-ink-400 font-mono mt-4 pt-4 border-t border-ink-100">
                  Preview truncated — showing the first 3,000 characters.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
