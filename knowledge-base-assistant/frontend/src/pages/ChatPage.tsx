import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ChatWindow from '../components/chat/ChatWindow';
import FileTypeStamp from '../components/common/FileTypeStamp';
import ErrorState from '../components/common/ErrorState';
import * as documentService from '../services/documentService';
import * as chatService from '../services/chatService';
import { getErrorMessage } from '../services/api';
import type { DocumentItem, ConversationItem } from '../types';

const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const documentId = searchParams.get('documentId') || '';

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    documentService
      .getDocuments(1, 50)
      .then(({ data }) => setDocuments(data.data.documents))
      .catch((err) => setLoadError(getErrorMessage(err)));
  }, []);

  const selectedDocument = documents.find((d) => d._id === documentId);

  const fetchHistoryForDocument = useCallback(async (docId: string) => {
    if (!docId) {
      setConversations([]);
      return;
    }
    try {
      const { data } = await chatService.getHistory(1, 50, '', docId);
      setConversations(data.data.conversations.slice().reverse());
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    fetchHistoryForDocument(documentId);
  }, [documentId, fetchHistoryForDocument]);

  const handleSelectDocument = (id: string) => {
    setSearchParams(id ? { documentId: id } : {});
    setError('');
  };

  const handleSend = async (question: string) => {
    if (!documentId) return;
    setIsSending(true);
    setError('');
    try {
      const { data } = await chatService.askQuestion(documentId, question);
      setConversations((prev) => [...prev, data.data.conversation]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  };

  const usableDocuments = documents.filter((d) => d.extractionStatus === 'success');

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-semibold text-ink-900">AI Knowledge Base Assistant</h1>
        <p className="text-sm text-ink-400 mt-1">Ask questions grounded in one of your documents</p>
      </div>

      <div className="mb-5 max-w-sm">
        <label className="label">Document</label>
        <select
          className="input-field"
          value={documentId}
          onChange={(e) => handleSelectDocument(e.target.value)}
        >
          <option value="">Select a document…</option>
          {usableDocuments.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name}
            </option>
          ))}
        </select>
        {documents.length > 0 && usableDocuments.length === 0 && (
          <p className="text-xs text-signal-error mt-1.5">
            None of your documents have usable extracted text yet.
          </p>
        )}
      </div>

      {selectedDocument && (
        <div className="flex items-center gap-2 mb-4">
          <FileTypeStamp fileType={selectedDocument.fileType} />
          <span className="text-sm text-ink-600 truncate">{selectedDocument.name}</span>
        </div>
      )}

      {loadError ? (
        <ErrorState message={loadError} />
      ) : (
        <>
          <ChatWindow
            conversations={conversations}
            onSend={handleSend}
            isSending={isSending}
            disabled={!documentId}
            disabledReason={documents.length === 0 ? 'Upload a document first' : 'Select a document to begin'}
          />
          {error && <p className="text-sm text-signal-error mt-3">{error}</p>}
        </>
      )}
    </MainLayout>
  );
};

export default ChatPage;