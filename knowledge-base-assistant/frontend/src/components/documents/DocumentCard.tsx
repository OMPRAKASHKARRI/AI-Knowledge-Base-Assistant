import { Eye, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DocumentItem } from '../../types';
import FileTypeStamp from '../common/FileTypeStamp';
import { formatDate, formatFileSize } from '../../utils/format';

interface DocumentCardProps {
  document: DocumentItem;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentCard = ({ document, onPreview, onDelete }: DocumentCardProps) => (
  <div className="card p-4 flex items-center justify-between gap-4">
    <div className="min-w-0 flex items-center gap-3">
      <FileTypeStamp fileType={document.fileType} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink-800 truncate">{document.name}</p>
        <p className="text-xs text-ink-400 font-mono">
          {formatDate(document.createdAt)} · {formatFileSize(document.sizeInBytes)}
        </p>
        {document.extractionStatus === 'failed' && (
          <p className="text-xs text-signal-error flex items-center gap-1 mt-1">
            <AlertCircle className="w-3 h-3" /> {document.extractionError || 'Text extraction failed'}
          </p>
        )}
      </div>
    </div>

    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => onPreview(document._id)}
        disabled={document.extractionStatus !== 'success'}
        className="p-2 text-ink-400 hover:text-ledger-500 hover:bg-ink-100 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        aria-label="Preview document"
        title="Preview"
      >
        <Eye className="w-4 h-4" />
      </button>
      <Link
        to={`/chat?documentId=${document._id}`}
        className="p-2 text-ink-400 hover:text-ledger-500 hover:bg-ink-100 rounded-md transition-colors"
        aria-label="Ask a question about this document"
        title="Ask AI"
      >
        <MessageSquare className="w-4 h-4" />
      </Link>
      <button
        onClick={() => onDelete(document._id)}
        className="p-2 text-ink-400 hover:text-signal-error hover:bg-signal-error/5 rounded-md transition-colors"
        aria-label="Delete document"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default DocumentCard;
