import { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { X, UploadCloud } from 'lucide-react';
import * as documentService from '../../services/documentService';
import { getErrorMessage } from '../../services/api';

const ACCEPTED_EXTENSIONS = ['.pdf', '.txt', '.md'];

interface UploadModalProps {
  onClose: () => void;
  onUploaded: () => void;
}

const UploadModal = ({ onClose, onUploaded }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (candidate: File) => {
    const ext = candidate.name.slice(candidate.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type "${ext}". Only PDF, TXT, and MD files are allowed.`);
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }
    setError('');
    setFile(candidate);
    if (!name) setName(candidate.name.replace(ext, ''));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      await documentService.uploadDocument(file, name, setProgress);
      onUploaded();
    } catch (err) {
      setError(getErrorMessage(err));
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-lg text-ink-900">Upload document</h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-400 hover:text-ink-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="text-sm text-signal-error bg-signal-error/5 border border-signal-error/20 rounded-md px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-ledger-500 bg-ledger-50' : 'border-ink-200 hover:border-ink-400'
          }`}
        >
          <UploadCloud className="w-7 h-7 mx-auto text-ink-400 mb-2" strokeWidth={1.5} />
          {file ? (
            <p className="text-sm font-medium text-ink-800">{file.name}</p>
          ) : (
            <>
              <p className="text-sm text-ink-600">Drop a file here, or click to browse</p>
              <p className="text-xs text-ink-400 mt-1 font-mono">PDF · TXT · MD — max 10MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.md"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div className="mt-4">
            <label className="label">Document name</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Give it a memorable name"
            />
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
              <div className="h-full bg-ledger-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-ink-400 mt-1.5 font-mono">Uploading… {progress}%</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={isUploading}>
            Cancel
          </button>
          <button onClick={handleUpload} className="btn-primary flex-1" disabled={!file || isUploading}>
            {isUploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
