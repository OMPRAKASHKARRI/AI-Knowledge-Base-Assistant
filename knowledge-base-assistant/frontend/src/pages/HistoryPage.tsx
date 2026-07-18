import { useCallback, useEffect, useState } from 'react';
import { Search, History as HistoryIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import PaginationControls from '../components/common/Pagination';
import FileTypeStamp from '../components/common/FileTypeStamp';
import * as chatService from '../services/chatService';
import { getErrorMessage } from '../services/api';
import type { ConversationItem, Pagination } from '../types';
import { formatDate } from '../utils/format';

const HistoryPage = () => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await chatService.getHistory(page, 10, search);
      setConversations(data.data.conversations);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    const timeout = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-ink-900">AI Knowledge Base History</h1>
        <p className="text-sm text-ink-400 mt-1">Every question you've asked, across all documents</p>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          className="input-field !pl-9"
          placeholder="Search questions and answers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <Loader label="Loading history…" />}
      {!isLoading && error && <ErrorState message={error} onRetry={fetchHistory} />}

      {!isLoading && !error && conversations.length === 0 && (
        <EmptyState
          icon={HistoryIcon}
          title={search ? 'No conversations match your search' : 'No conversations yet'}
          description={search ? 'Try a different search term.' : 'Ask a question from the Ask AI page to see it here.'}
        />
      )}

      {!isLoading && !error && conversations.length > 0 && (
        <>
          <div className="space-y-3">
            {conversations.map((conv) => {
              const doc = typeof conv.document === 'object' ? conv.document : null;
              return (
                <div key={conv._id} className="card p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {doc && <FileTypeStamp fileType={doc.fileType} />}
                      <span className="text-xs text-ink-400 font-mono truncate">{doc?.name}</span>
                    </div>
                    <span className="text-xs text-ink-400 font-mono shrink-0">{formatDate(conv.createdAt)}</span>
                  </div>
                  <p className="text-sm font-medium text-ink-800 mb-1">{conv.question}</p>
                  <p className="text-sm text-ink-600 line-clamp-2">{conv.answer}</p>
                </div>
              );
            })}
          </div>
          {pagination && <PaginationControls pagination={pagination} onPageChange={setPage} />}
        </>
      )}
    </MainLayout>
  );
};

export default HistoryPage;