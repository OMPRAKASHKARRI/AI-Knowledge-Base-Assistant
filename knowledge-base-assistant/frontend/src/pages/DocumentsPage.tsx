import { useCallback, useEffect, useState } from 'react';
import { Search, Plus, FileStack } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import PaginationControls from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DocumentCard from '../components/documents/DocumentCard';
import UploadModal from '../components/documents/UploadModal';
import DocumentPreviewModal from '../components/documents/DocumentPreviewModal';
import * as documentService from '../services/documentService';
import { getErrorMessage } from '../services/api';
import type { DocumentItem, Pagination } from '../types';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showUpload, setShowUpload] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await documentService.getDocuments(page, 10, search);
      setDocuments(data.data.documents);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const timeout = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await documentService.deleteDocument(deleteId);
      setDeleteId(null);
      fetchDocuments();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink-900">AI Knowledge Base Documents</h1>
          <p className="text-sm text-ink-400 mt-1">Manage the files in your knowledge base</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Upload document
        </button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          className="input-field !pl-9"
          placeholder="Search documents…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <Loader label="Loading documents…" />}
      {!isLoading && error && <ErrorState message={error} onRetry={fetchDocuments} />}

      {!isLoading && !error && documents.length === 0 && (
        <EmptyState
          icon={FileStack}
          title={search ? 'No documents match your search' : 'No documents yet'}
          description={
            search ? 'Try a different search term.' : 'Upload a PDF, TXT, or Markdown file to get started.'
          }
          action={
            !search && (
              <button onClick={() => setShowUpload(true)} className="btn-primary">
                Upload a document
              </button>
            )
          }
        />
      )}

      {!isLoading && !error && documents.length > 0 && (
        <>
          <div className="space-y-3">
            {documents.map((doc) => (
              <DocumentCard key={doc._id} document={doc} onPreview={setPreviewId} onDelete={setDeleteId} />
            ))}
          </div>
          {pagination && <PaginationControls pagination={pagination} onPageChange={setPage} />}
        </>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
            fetchDocuments();
          }}
        />
      )}

      {previewId && <DocumentPreviewModal documentId={previewId} onClose={() => setPreviewId(null)} />}

      {deleteId && (
        <ConfirmDialog
          title="Delete document"
          message="This will permanently delete the document and its chat history. This can't be undone."
          confirmLabel="Delete"
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </MainLayout>
  );
};

export default DocumentsPage;